/**
 * OVERVOLT — PC Builder (Configurador Paso a Paso)
 * Quiet HUD Mode / CompatibilityEngine Single Source of Truth
 */

(function () {
  // SVG Icons for Category Steps
  const CATEGORY_ICONS = {
    cpu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/></svg>`,
    motherboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h3v4H7zM14 7h3v2h-3zM7 14h10v3H7z"/></svg>`,
    cooler: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 12L8 8M12 12l4-4M12 12l-4 4M12 12l4 4"/></svg>`,
    ram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 14v2M10 14v2M14 14v2M18 14v2"/></svg>`,
    storage: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="7" cy="12" r="1.5"/><line x1="12" y1="12" x2="17" y2="12"/></svg>`,
    gpu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="3"/><circle cx="16" cy="12" r="3"/></svg>`,
    psu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 12h3M14 10l3 4M17 10l-3 4"/></svg>`,
    case: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="5" y1="7" x2="19" y2="7"/><circle cx="12" cy="4.5" r="1"/></svg>`,
    accessories: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`
  };

  // Steps Definition with Concise Descriptions
  const BUILDER_STEPS = [
    { key: "cpu", label: "Procesador", shortLabel: "Procesador", description: "El procesador es el núcleo de rendimiento del equipo. Su socket determina la compatibilidad con la placa madre.", icon: CATEGORY_ICONS.cpu, brandOptions: ["Todos", "AMD", "Intel"] },
    { key: "motherboard", label: "Placa Madre", shortLabel: "Placa Madre", description: "La placa madre conecta todos los componentes. Debe coincidir con el socket del procesador seleccionado.", icon: CATEGORY_ICONS.motherboard, brandOptions: ["Todos", "ASUS", "Voltek", "MSI", "Gigabyte"] },
    { key: "cooler", label: "Cooler / Disipador", shortLabel: "Cooler", description: "Refrigeración de aire o líquida. Verifica la compatibilidad de zócalo y altura máxima dentro del gabinete.", icon: CATEGORY_ICONS.cooler, brandOptions: ["Todos", "Voltek", "Raptix"] },
    { key: "ram", label: "Memoria RAM", shortLabel: "RAM", description: "Capacidad y velocidad de memoria. Debe coincidir con la tecnología (DDR4 / DDR5) de tu placa madre.", icon: CATEGORY_ICONS.ram, brandOptions: ["Todos", "Nexcore", "Voltek"] },
    { key: "storage", label: "Almacenamiento", shortLabel: "Almacenamiento", description: "Unidades SSD NVMe de alta velocidad o SATA para guardar tus sistemas y juegos.", icon: CATEGORY_ICONS.storage, brandOptions: ["Todos", "Zenith", "Nexcore"] },
    { key: "gpu", label: "Placa de Video", shortLabel: "Placa de Video", description: "Procesamiento gráfico dedicado para gaming y diseño. Define la potencia gráfica y consumo eléctrico.", icon: CATEGORY_ICONS.gpu, brandOptions: ["Todos", "NVIDIA", "AMD", "Zenith"] },
    { key: "psu", label: "Fuente de Poder", shortLabel: "Fuente de Poder", description: "Suministro eléctrico del equipo. Debe cubrir el consumo en vatios (TDP) total acumulado.", icon: CATEGORY_ICONS.psu, brandOptions: ["Todos", "Voltek", "Corsair"] },
    { key: "case", label: "Gabinete", shortLabel: "Gabinete", description: "Chasis para montar el equipo. Garantiza espacio suficiente para la placa de video y el disipador.", icon: CATEGORY_ICONS.case, brandOptions: ["Todos", "Nexcore", "Raptix"] },
    { key: "accessories", label: "Accesorios y Periféricos", shortLabel: "Accesorios", description: "Paso opcional. Podés agregar monitor, teclado, mouse o auriculares a tu orden final.", icon: CATEGORY_ICONS.accessories, brandOptions: ["Todos", "Perifericos", "Monitores"], isOptional: true }
  ];

  // Fallback Product Catalog
  const DEFAULT_CATALOG = [
    { "id": "flash-cpu", "name": "AMD Ryzen 7 7800X3D", "brand": "AMD", "category": "cpu", "price": 469999, "img": "assets/flash_cpu.png", "socket": "AM5", "tdp": 120 },
    { "id": "cpu-ryzen-7600x", "name": "AMD Ryzen 5 7600X", "brand": "AMD", "category": "cpu", "price": 289999, "img": "assets/flash_cpu.png", "socket": "AM5", "tdp": 105 },
    { "id": "cpu-intel-14700k", "name": "Intel Core i7-14700K", "brand": "Intel", "category": "cpu", "price": 539999, "img": "assets/flash_cpu.png", "socket": "LGA1700", "tdp": 125 },
    { "id": "cpu-intel-13400f", "name": "Intel Core i5-13400F", "brand": "Intel", "category": "cpu", "price": 249999, "img": "assets/flash_cpu.png", "socket": "LGA1700", "tdp": 65 },

    { "id": "flash-mobo", "name": "Motherboard Voltek B650 Wifi", "brand": "Voltek", "category": "motherboard", "price": 199999, "img": "assets/flash_mobo.png", "socket": "AM5", "ramType": "DDR5" },
    { "id": "mobo-asus-b650m", "name": "Motherboard ASUS TUF B650M-PLUS", "brand": "ASUS", "category": "motherboard", "price": 219999, "img": "assets/flash_mobo.png", "socket": "AM5", "ramType": "DDR5" },
    { "id": "mobo-msi-z790", "name": "Motherboard MSI Pro Z790-P Wifi", "brand": "MSI", "category": "motherboard", "price": 289999, "img": "assets/flash_mobo.png", "socket": "LGA1700", "ramType": "DDR5" },
    { "id": "mobo-gigabyte-b760m", "name": "Motherboard Gigabyte B760M DS3H", "brand": "Gigabyte", "category": "motherboard", "price": 169999, "img": "assets/flash_mobo.png", "socket": "LGA1700", "ramType": "DDR4" },

    { "id": "cool-1", "name": "Cooler Líquido 360mm Voltek ARGB", "brand": "Voltek", "category": "cooler", "price": 164999, "img": "assets/flash_cooler.svg", "heightMm": 155, "supportedSockets": ["AM4", "AM5", "LGA1700"] },
    { "id": "cool-raptix-air", "name": "Cooler CPU Raptix Air Tower", "brand": "Raptix", "category": "cooler", "price": 45999, "img": "assets/flash_cooler.svg", "heightMm": 160, "supportedSockets": ["AM4", "AM5", "LGA1700"] },

    { "id": "ram-1", "name": "Memoria RAM DDR5 32GB Kit (2x16GB)", "brand": "Nexcore", "category": "ram", "price": 189999, "img": "assets/flash_ram.svg", "ramType": "DDR5" },
    { "id": "ram-ddr4-16g", "name": "Memoria RAM Voltek DDR4 16GB (2x8GB)", "brand": "Voltek", "category": "ram", "price": 69999, "img": "assets/flash_ram.svg", "ramType": "DDR4" },

    { "id": "ssd-1", "name": "SSD NVMe M.2 PCIe 4.0 2TB Zenith", "brand": "Zenith", "category": "storage", "price": 224999, "img": "assets/flash_ssd.svg" },
    { "id": "ssd-nexcore-1t", "name": "SSD NVMe M.2 PCIe 3.0 1TB Nexcore", "brand": "Nexcore", "category": "storage", "price": 114999, "img": "assets/flash_ssd.svg" },

    { "id": "flash-gpu", "name": "Placa de Video Zenith RTX 4070 Ti 12GB", "brand": "Zenith", "category": "gpu", "price": 789999, "img": "assets/flash_gpu.png", "lengthMm": 305, "tdp": 285 },
    { "id": "gpu-rtx-4060", "name": "Placa de Video NVIDIA RTX 4060 8GB", "brand": "NVIDIA", "category": "gpu", "price": 429999, "img": "assets/flash_gpu.png", "lengthMm": 242, "tdp": 115 },

    { "id": "psu-1", "name": "Fuente 850W 80 Plus Gold Voltek", "brand": "Voltek", "category": "psu", "price": 159999, "img": "assets/flash_psu.svg", "wattage": 850 },
    { "id": "psu-corsair-650w", "name": "Fuente Corsair CV650 650W 80 Plus Bronze", "brand": "Corsair", "category": "psu", "price": 99999, "img": "assets/flash_psu.svg", "wattage": 650 },

    { "id": "case-1", "name": "Gabinete ATX Mesh RGB Nexcore", "brand": "Nexcore", "category": "case", "price": 134999, "img": "assets/flash_case.svg", "maxGpuLengthMm": 400 },
    { "id": "case-raptix-compact", "name": "Gabinete Micro-ATX Raptix Air Flow", "brand": "Raptix", "category": "case", "price": 89999, "img": "assets/flash_case.svg", "maxGpuLengthMm": 320 },

    { "id": "flash-mouse", "name": "Mouse Inalámbrico Voltek Pro 26K", "brand": "Voltek", "category": "accessories", "price": 59999, "img": "assets/flash_mouse.png" },
    { "id": "flash-headset", "name": "Auriculares Hypergen RGB 7.1", "brand": "Raptix", "category": "accessories", "price": 79999, "img": "assets/flash_headset.png" },
    { "id": "flash-keyboard", "name": "Teclado Mecánico Raptix Pro RGB", "brand": "Raptix", "category": "accessories", "price": 99999, "img": "assets/flash_keyboard.png" },
    { "id": "flash-monitor", "name": "Monitor Nexcore 27\" QHD 165Hz", "brand": "Nexcore", "category": "accessories", "price": 349999, "img": "assets/flash_monitor.png" }
  ];

  // Configurator State
  let rootEl = null;
  let catalog = [];
  let activeStepIndex = 0;
  let isSummaryView = false;
  let brandFilter = "Todos";
  let selections = {
    cpu: null, motherboard: null, cooler: null, ram: null,
    storage: null, gpu: null, psu: null, case: null, accessories: null
  };

  function formatMoney(amount) {
    return "$" + Math.floor(amount).toLocaleString("es-AR");
  }

  async function loadCatalogData() {
    try {
      const res = await fetch("component-comparator/catalog.example.json");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          catalog = data;
          return;
        }
      }
    } catch (e) {}
    catalog = DEFAULT_CATALOG;
  }

  async function init() {
    rootEl = document.getElementById("pc-builder-root");
    if (!rootEl) return;

    await loadCatalogData();
    renderApp();
  }

  function getSelectedComponentsList() {
    return Object.values(selections).filter(Boolean);
  }

  function calculateSubtotal() {
    return Object.values(selections).reduce((sum, item) => sum + (item ? Number(item.price || 0) : 0), 0);
  }

  function calculateEstimatedWatts() {
    let cpuTdp = selections.cpu ? Number(selections.cpu.tdp || 0) : 0;
    let gpuTdp = selections.gpu ? Number(selections.gpu.tdp || 0) : 0;
    if (cpuTdp === 0 && gpuTdp === 0) return 0;
    return cpuTdp + gpuTdp + 50;
  }

  function evaluateProductState(product) {
    const currentList = getSelectedComponentsList();
    // Rule: Hide compatibility state indicator if no reference item selected yet
    if (currentList.length === 0) {
      return { state: "NONE", reason: "" };
    }

    if (typeof window.CompatibilityEngine === "undefined") {
      return { state: "COMPATIBLE", reason: "" };
    }

    const result = window.CompatibilityEngine.evaluateCandidate(currentList, product);

    if (result.overallStatus === "INCOMPATIBLE" || (result.rulesEvaluated && result.rulesEvaluated.some(r => r.status === "INCOMPATIBLE"))) {
      const failRule = result.rulesEvaluated.find(r => r.status === "INCOMPATIBLE");
      return { state: "INCOMPATIBLE", reason: failRule ? failRule.message : "Incompatible con tu selección actual." };
    }

    if (result.overallStatus === "ADVERTENCIA" || (result.rulesEvaluated && result.rulesEvaluated.some(r => r.status === "ADVERTENCIA"))) {
      const warnRule = result.rulesEvaluated.find(r => r.status === "ADVERTENCIA");
      return { state: "ADVERTENCIA", reason: warnRule ? warnRule.message : "Advertencia de compatibilidad." };
    }

    return { state: "COMPATIBLE", reason: "" };
  }

  function renderApp() {
    if (!rootEl) return;

    rootEl.innerHTML = `
      <div class="ov-builder-container">
        <div class="ov-builder-header-box">
          <p class="eyebrow">Configurador de Hardware</p>
          <h1>Armá tu PC Gamer</h1>
          <p>Seleccioná componente por componente. La compatibilidad física y eléctrica se verifica automáticamente contra tu selección actual.</p>
        </div>

        <div class="ov-builder-layout">
          <aside class="ov-builder-sidebar" id="ovBuilderSidebar"></aside>
          <main class="ov-builder-main" id="ovBuilderMain"></main>
        </div>

        <div class="ov-builder-bottom-bar" id="ovBuilderBottomBar"></div>
      </div>
    `;

    renderSidebar();
    renderMainContent();
    renderBottomBar();
  }

  function renderSidebar() {
    const sidebarContainer = document.getElementById("ovBuilderSidebar");
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = `
      <div class="ov-builder-sidebar-title">
        <span>Componentes</span>
        <span>${activeStepIndex + 1}/${BUILDER_STEPS.length}</span>
      </div>
      <ul class="ov-builder-steps-list">
        ${BUILDER_STEPS.map((step, idx) => {
          const isSelected = !!selections[step.key];
          const isActive = activeStepIndex === idx && !isSummaryView;
          const snippet = isSelected ? selections[step.key].name : (step.isOptional ? "Opcional" : "Pendiente");

          let classes = "ov-builder-step-item";
          if (isActive) classes += " is-active";
          if (isSelected) classes += " is-completed";

          return `
            <li class="${classes}" data-step-index="${idx}" tabindex="0">
              <div class="ov-builder-step-icon">${step.icon}</div>
              <div class="ov-builder-step-info">
                <span class="ov-builder-step-name">${step.shortLabel}</span>
                <span class="ov-builder-step-selected-snippet">${snippet}</span>
              </div>
              ${isSelected ? `<div class="ov-builder-step-check">✓</div>` : ''}
            </li>
          `;
        }).join('')}
      </ul>
    `;

    sidebarContainer.querySelectorAll(".ov-builder-step-item").forEach(item => {
      item.addEventListener("click", () => {
        goToStep(Number(item.dataset.stepIndex));
      });
    });
  }

  function renderMainContent() {
    const mainContainer = document.getElementById("ovBuilderMain");
    if (!mainContainer) return;

    if (isSummaryView) {
      renderSummaryView(mainContainer);
      return;
    }

    const currentStep = BUILDER_STEPS[activeStepIndex];

    let categoryProducts = catalog.filter(p => {
      const cat = (p.category || "").toLowerCase();
      if (currentStep.key === "accessories") {
        return cat === "accessories" || cat === "perifericos" || cat === "monitores";
      }
      return cat === currentStep.key;
    });

    if (brandFilter !== "Todos") {
      categoryProducts = categoryProducts.filter(p => {
        const brand = (p.brand || "").toUpperCase();
        return brand.includes(brandFilter.toUpperCase());
      });
    }

    mainContainer.innerHTML = `
      <div class="ov-builder-step-header">
        <div class="ov-builder-step-title-box">
          <h2>Elegí tu ${currentStep.label}</h2>
          <p>${currentStep.description}</p>
        </div>

        ${currentStep.brandOptions ? `
          <div class="ov-builder-brand-bar">
            ${currentStep.brandOptions.map(b => `
              <button class="ov-brand-chip ${brandFilter === b ? 'is-active' : ''}" data-brand="${b}">
                ${b}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="ov-builder-grid">
        ${categoryProducts.length === 0 ? `
          <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #64748b;">
            No se encontraron productos disponibles para esta marca.
          </div>
        ` : categoryProducts.map(p => {
          const evalResult = evaluateProductState(p);
          const isSelected = selections[currentStep.key] && selections[currentStep.key].id === p.id;
          
          let cardClasses = "ov-builder-card";
          if (isSelected) cardClasses += " is-selected";
          if (evalResult.state === "INCOMPATIBLE") cardClasses += " is-incompatible";

          return `
            <div class="${cardClasses}" data-id="${p.id}" tabindex="0">
              <div class="ov-builder-card-thumb">
                <img src="${p.img || 'assets/flash_gpu.png'}" alt="${p.name}" />
              </div>

              <div class="ov-builder-card-info">
                <h3 class="ov-builder-card-name">${p.name}</h3>

                ${evalResult.reason ? `
                  <div class="ov-builder-reason-banner">${evalResult.reason}</div>
                ` : ''}

                <div class="ov-builder-card-footer">
                  <span class="ov-builder-card-price">${formatMoney(p.price)}</span>
                  
                  <!-- Single text state signal -->
                  ${isSelected ? `
                    <span class="ov-builder-status-text status-selected">✓ Elegido</span>
                  ` : evalResult.state === "COMPATIBLE" ? `
                    <span class="ov-builder-status-text status-compatible">✓ Compatible</span>
                  ` : evalResult.state === "INCOMPATIBLE" ? `
                    <span class="ov-builder-status-text status-incompatible">✕ Incompatible</span>
                  ` : evalResult.state === "ADVERTENCIA" ? `
                    <span class="ov-builder-status-text status-warning">⚠️ Advertencia</span>
                  ` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    mainContainer.querySelectorAll(".ov-brand-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        brandFilter = chip.dataset.brand;
        renderMainContent();
      });
    });

    mainContainer.querySelectorAll(".ov-builder-card").forEach(card => {
      const productId = card.dataset.id;
      const productObj = categoryProducts.find(p => p.id === productId);

      const handleSelect = () => {
        const evalResult = evaluateProductState(productObj);
        if (evalResult.state === "INCOMPATIBLE") return;

        if (selections[currentStep.key] && selections[currentStep.key].id === productId) {
          selections[currentStep.key] = null;
        } else {
          selections[currentStep.key] = productObj;
        }

        renderSidebar();
        renderMainContent();
        renderBottomBar();
      };

      card.addEventListener("click", handleSelect);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
        }
      });
    });
  }

  function renderBottomBar() {
    const barContainer = document.getElementById("ovBuilderBottomBar");
    if (!barContainer) return;

    const subtotal = calculateSubtotal();
    const watts = calculateEstimatedWatts();
    const isLastStep = activeStepIndex === BUILDER_STEPS.length - 1;
    const hasSelection = !!selections[BUILDER_STEPS[activeStepIndex]?.key];

    barContainer.innerHTML = `
      <div class="ov-builder-bar-content">
        <div class="ov-builder-bar-stats">
          <div class="ov-builder-stat-item">
            <span class="ov-builder-stat-label">SUBTOTAL ESTIMADO</span>
            <span class="ov-builder-stat-value">${formatMoney(subtotal)}</span>
          </div>

          <div class="ov-builder-stat-item">
            <span class="ov-builder-stat-label">CONSUMO ESTIMADO</span>
            <span class="ov-builder-stat-value value-wattage">⚡ ${watts > 0 ? watts + "W" : "N/A"}</span>
          </div>
        </div>

        <div class="ov-builder-bar-actions">
          ${activeStepIndex > 0 || isSummaryView ? `
            <button class="ov-btn-cyber btn-secondary" id="ovBtnPrev">Volver</button>
          ` : ''}

          ${!isSummaryView ? `
            <button class="ov-btn-cyber btn-secondary" id="ovBtnSkip">Saltar paso</button>
            <button class="ov-btn-cyber btn-accent" id="ovBtnNext">
              ${isLastStep ? "Ver resumen del armado" : (hasSelection ? "Siguiente paso" : "Siguiente (Saltar)")}
            </button>
          ` : `
            <button class="ov-btn-cyber btn-accent" id="ovBtnAddToCart">🛒 Agregar armado al carrito</button>
          `}
        </div>
      </div>
    `;

    const btnPrev = document.getElementById("ovBtnPrev");
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        if (isSummaryView) {
          isSummaryView = false;
          activeStepIndex = BUILDER_STEPS.length - 1;
        } else if (activeStepIndex > 0) {
          activeStepIndex--;
          brandFilter = "Todos";
        }
        renderSidebar();
        renderMainContent();
        renderBottomBar();
      });
    }

    const btnSkip = document.getElementById("ovBtnSkip");
    if (btnSkip) {
      btnSkip.addEventListener("click", () => {
        selections[BUILDER_STEPS[activeStepIndex].key] = null;
        advanceStep();
      });
    }

    const btnNext = document.getElementById("ovBtnNext");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        advanceStep();
      });
    }

    const btnAddToCart = document.getElementById("ovBtnAddToCart");
    if (btnAddToCart) {
      btnAddToCart.addEventListener("click", () => {
        addToCartBuild();
      });
    }
  }

  function advanceStep() {
    if (activeStepIndex < BUILDER_STEPS.length - 1) {
      activeStepIndex++;
      brandFilter = "Todos";
    } else {
      isSummaryView = true;
    }
    renderSidebar();
    renderMainContent();
    renderBottomBar();
  }

  function goToStep(index) {
    if (index >= 0 && index < BUILDER_STEPS.length) {
      activeStepIndex = index;
      isSummaryView = false;
      brandFilter = "Todos";
      renderSidebar();
      renderMainContent();
      renderBottomBar();
    }
  }

  function renderSummaryView(container) {
    const selectedList = getSelectedComponentsList();
    const subtotal = calculateSubtotal();

    let globalReport = { overallStatus: "COMPATIBLE", rulesEvaluated: [] };
    if (typeof window.CompatibilityEngine !== "undefined") {
      globalReport = window.CompatibilityEngine.checkAllCompatibility(selectedList);
    }

    container.innerHTML = `
      <div class="ov-builder-summary">
        <div class="ov-builder-summary-header">
          <h2>Resumen de tu Armado Gamer</h2>
          <button class="ov-summary-edit-btn" id="ovEditBuildBtn">Editar Selección</button>
        </div>

        <table class="ov-summary-table">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Componente Seleccionado</th>
              <th>Precio</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${BUILDER_STEPS.map((step, idx) => {
              const item = selections[step.key];
              return `
                <tr>
                  <td class="ov-summary-item-category">${step.label}</td>
                  <td>
                    ${item ? `
                      <div class="ov-summary-item-name">
                        <img src="${item.img || 'assets/flash_gpu.png'}" alt="${item.name}" />
                        <span>${item.name}</span>
                      </div>
                    ` : `
                      <span style="color: #64748b; font-style: italic;">Sin seleccionar</span>
                    `}
                  </td>
                  <td class="ov-summary-item-price">${item ? formatMoney(item.price) : "-"}</td>
                  <td>
                    <button class="ov-summary-edit-btn" data-step-idx="${idx}">Cambiar</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="ov-summary-report-box">
          <h3>Informe Técnico de Compatibilidad Global</h3>
          ${globalReport.rulesEvaluated.length === 0 ? `
            <p style="color: #64748b; margin: 0; font-size: 13px;">Se requieren al menos 2 componentes clave para evaluar compatibilidad global.</p>
          ` : `
            <div>
              ${globalReport.rulesEvaluated.map(r => `
                <div class="ov-rule-card ${r.status === 'COMPATIBLE' ? 'rule-compatible' : (r.status === 'INCOMPATIBLE' ? 'rule-incompatible' : 'rule-warning')}">
                  <div><strong>${r.ruleName}:</strong> ${r.message}</div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <div class="ov-summary-total-bar">
          <div>
            <div class="ov-summary-total-label">SUBTOTAL ARMADO + TESTEO INCLUIDO</div>
            <div class="ov-summary-total-price">${formatMoney(subtotal)}</div>
          </div>

          <button class="ov-btn-cyber btn-accent" id="ovSummaryAddToCartBtn">
            🛒 Agregar armado al carrito
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll(".ov-summary-edit-btn[data-step-idx]").forEach(btn => {
      btn.addEventListener("click", () => {
        goToStep(Number(btn.dataset.stepIdx));
      });
    });

    const editBuildBtn = document.getElementById("ovEditBuildBtn");
    if (editBuildBtn) {
      editBuildBtn.addEventListener("click", () => {
        goToStep(0);
      });
    }

    const summaryAddToCartBtn = document.getElementById("ovSummaryAddToCartBtn");
    if (summaryAddToCartBtn) {
      summaryAddToCartBtn.addEventListener("click", () => {
        addToCartBuild();
      });
    }
  }

  function addToCartBuild() {
    const selectedList = getSelectedComponentsList();
    if (selectedList.length === 0) {
      alert("Seleccioná al menos un componente para continuar.");
      return;
    }

    // Save selected build items into localStorage for cart retrieval
    try {
      let existingCart = JSON.parse(localStorage.getItem("overvolt_cart") || "[]");
      selectedList.forEach(item => {
        existingCart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          img: item.img || "assets/flash_gpu.png",
          category: item.category || "Componentes",
          qty: 1
        });
      });
      localStorage.setItem("overvolt_cart", JSON.stringify(existingCart));
    } catch (e) {}

    // Redirect to main store page with cart drawer trigger
    window.location.href = "index.html?cart_opened=true";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

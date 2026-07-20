/**
 * OVERVOLT — PC Builder (Step-by-Step Configurator)
 * Powered by CompatibilityEngine (single source of truth for hardware rules).
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

  // 8 Core Steps + 1 Accessories Step
  const BUILDER_STEPS = [
    { key: "cpu", label: "Procesador", shortLabel: "CPU", icon: CATEGORY_ICONS.cpu, brandOptions: ["TODOS", "AMD", "INTEL"] },
    { key: "motherboard", label: "Placa Madre", shortLabel: "Motherboard", icon: CATEGORY_ICONS.motherboard, brandOptions: ["TODOS", "ASUS", "VOLTEK", "MSI", "GIGABYTE"] },
    { key: "cooler", label: "Cooler / Disipador", shortLabel: "Cooler", icon: CATEGORY_ICONS.cooler, brandOptions: ["TODOS", "VOLTEK", "RAPTIX"] },
    { key: "ram", label: "Memoria RAM", shortLabel: "RAM", icon: CATEGORY_ICONS.ram, brandOptions: ["TODOS", "NEXCORE", "VOLTEK"] },
    { key: "storage", label: "Almacenamiento", shortLabel: "Storage", icon: CATEGORY_ICONS.storage, brandOptions: ["TODOS", "ZENITH", "NEXCORE"] },
    { key: "gpu", label: "Placa de Video", shortLabel: "GPU", icon: CATEGORY_ICONS.gpu, brandOptions: ["TODOS", "NVIDIA", "AMD", "ZENITH"] },
    { key: "psu", label: "Fuente de Poder", shortLabel: "Fuente", icon: CATEGORY_ICONS.psu, brandOptions: ["TODOS", "VOLTEK", "CORSAIR"] },
    { key: "case", label: "Gabinete", shortLabel: "Gabinete", icon: CATEGORY_ICONS.case, brandOptions: ["TODOS", "NEXCORE", "RAPTIX"] },
    { key: "accessories", label: "Periféricos y Accesorios", shortLabel: "Accesorios", icon: CATEGORY_ICONS.accessories, brandOptions: ["TODOS", "PERIFERICOS", "MONITORES"], isOptional: true }
  ];

  // Embedded Fallback Catalog
  const DEFAULT_CATALOG = [
    { "id": "flash-cpu", "name": "AMD Ryzen 7 7800X3D", "brand": "AMD", "category": "cpu", "price": 469999, "img": "assets/flash_cpu.png", "socket": "AM5", "tdp": 120, "generation": "Zen 4" },
    { "id": "cpu-ryzen-7600x", "name": "AMD Ryzen 5 7600X", "brand": "AMD", "category": "cpu", "price": 289999, "img": "assets/flash_cpu.png", "socket": "AM5", "tdp": 105, "generation": "Zen 4" },
    { "id": "cpu-intel-14700k", "name": "Intel Core i7-14700K", "brand": "INTEL", "category": "cpu", "price": 539999, "img": "assets/flash_cpu.png", "socket": "LGA1700", "tdp": 125, "generation": "14th Gen" },
    { "id": "cpu-intel-13400f", "name": "Intel Core i5-13400F", "brand": "INTEL", "category": "cpu", "price": 249999, "img": "assets/flash_cpu.png", "socket": "LGA1700", "tdp": 65, "generation": "13th Gen" },
    
    { "id": "flash-mobo", "name": "Motherboard Voltek B650 Wifi", "brand": "VOLTEK", "category": "motherboard", "price": 199999, "img": "assets/flash_mobo.png", "socket": "AM5", "ramType": "DDR5", "maxRamSpeed": 6400, "pcieSlots": 2, "m2Slots": 3, "formFactor": "ATX", "chipset": "B650" },
    { "id": "mobo-asus-b650m", "name": "Motherboard ASUS TUF B650M-PLUS", "brand": "ASUS", "category": "motherboard", "price": 219999, "img": "assets/flash_mobo.png", "socket": "AM5", "ramType": "DDR5", "maxRamSpeed": 6400, "pcieSlots": 2, "m2Slots": 2, "formFactor": "Micro-ATX", "chipset": "B650" },
    { "id": "mobo-msi-z790", "name": "Motherboard MSI Pro Z790-P Wifi", "brand": "MSI", "category": "motherboard", "price": 289999, "img": "assets/flash_mobo.png", "socket": "LGA1700", "ramType": "DDR5", "maxRamSpeed": 7000, "pcieSlots": 3, "m2Slots": 4, "formFactor": "ATX", "chipset": "Z790" },
    { "id": "mobo-gigabyte-b760m", "name": "Motherboard Gigabyte B760M DS3H", "brand": "GIGABYTE", "category": "motherboard", "price": 169999, "img": "assets/flash_mobo.png", "socket": "LGA1700", "ramType": "DDR4", "maxRamSpeed": 5333, "pcieSlots": 1, "m2Slots": 2, "formFactor": "Micro-ATX", "chipset": "B760" },

    { "id": "cool-1", "name": "Cooler Líquido 360mm Voltek ARGB", "brand": "VOLTEK", "category": "cooler", "price": 164999, "img": "assets/flash_cooler.svg", "heightMm": 155, "supportedSockets": ["AM4", "AM5", "LGA1700"] },
    { "id": "cool-raptix-air", "name": "Cooler CPU Raptix Air Tower", "brand": "RAPTIX", "category": "cooler", "price": 45999, "img": "assets/flash_cooler.svg", "heightMm": 160, "supportedSockets": ["AM4", "AM5", "LGA1700"] },

    { "id": "ram-1", "name": "Memoria RAM DDR5 32GB Kit (2x16GB)", "brand": "NEXCORE", "category": "ram", "price": 189999, "img": "assets/flash_ram.svg", "ramType": "DDR5", "speed": 6000 },
    { "id": "ram-ddr4-16g", "name": "Memoria RAM Voltek DDR4 16GB (2x8GB)", "brand": "VOLTEK", "category": "ram", "price": 69999, "img": "assets/flash_ram.svg", "ramType": "DDR4", "speed": 3200 },

    { "id": "ssd-1", "name": "SSD NVMe M.2 PCIe 4.0 2TB Zenith", "brand": "ZENITH", "category": "storage", "price": 224999, "img": "assets/flash_ssd.svg", "interface": "NVMe", "type": "M.2 PCIe 4.0" },
    { "id": "ssd-nexcore-1t", "name": "SSD NVMe M.2 PCIe 3.0 1TB Nexcore", "brand": "NEXCORE", "category": "storage", "price": 114999, "img": "assets/flash_ssd.svg", "interface": "NVMe", "type": "M.2 PCIe 3.0" },

    { "id": "flash-gpu", "name": "Placa de Video Zenith RTX 4070 Ti 12GB", "brand": "ZENITH", "category": "gpu", "price": 789999, "img": "assets/flash_gpu.png", "lengthMm": 305, "tdp": 285 },
    { "id": "gpu-rtx-4060", "name": "Placa de Video NVIDIA RTX 4060 8GB", "brand": "NVIDIA", "category": "gpu", "price": 429999, "img": "assets/flash_gpu.png", "lengthMm": 242, "tdp": 115 },
    { "id": "gpu-rx-7700xt", "name": "Placa de Video AMD Radeon RX 7700 XT", "brand": "AMD", "category": "gpu", "price": 529999, "img": "assets/flash_gpu.png", "lengthMm": 280, "tdp": 245 },

    { "id": "psu-1", "name": "Fuente 850W 80 Plus Gold Voltek", "brand": "VOLTEK", "category": "psu", "price": 159999, "img": "assets/flash_psu.svg", "wattage": 850, "certification": "80 Plus Gold" },
    { "id": "psu-corsair-650w", "name": "Fuente Corsair CV650 650W 80 Plus Bronze", "brand": "CORSAIR", "category": "psu", "price": 99999, "img": "assets/flash_psu.svg", "wattage": 650, "certification": "80 Plus Bronze" },

    { "id": "case-1", "name": "Gabinete ATX Mesh RGB Nexcore", "brand": "NEXCORE", "category": "case", "price": 134999, "img": "assets/flash_case.svg", "maxGpuLengthMm": 400, "maxCoolerHeightMm": 185, "formFactors": ["ATX", "Micro-ATX", "Mini-ITX"] },
    { "id": "case-raptix-compact", "name": "Gabinete Micro-ATX Raptix Air Flow", "brand": "RAPTIX", "category": "case", "price": 89999, "img": "assets/flash_case.svg", "maxGpuLengthMm": 320, "maxCoolerHeightMm": 155, "formFactors": ["Micro-ATX", "Mini-ITX"] },

    { "id": "flash-mouse", "name": "Mouse Inalámbrico Voltek Pro 26K", "brand": "VOLTEK", "category": "accessories", "price": 59999, "img": "assets/flash_mouse.png" },
    { "id": "flash-headset", "name": "Auriculares Hypergen RGB 7.1", "brand": "RAPTIX", "category": "accessories", "price": 79999, "img": "assets/flash_headset.png" },
    { "id": "flash-keyboard", "name": "Teclado Mecánico Raptix Pro RGB", "brand": "RAPTIX", "category": "accessories", "price": 99999, "img": "assets/flash_keyboard.png" },
    { "id": "flash-monitor", "name": "Monitor Nexcore 27\" QHD 165Hz", "brand": "NEXCORE", "category": "accessories", "price": 349999, "img": "assets/flash_monitor.png" }
  ];

  // Global Configurator State
  let rootEl = null;
  let catalog = [];
  let activeStepIndex = 0;
  let isSummaryView = false;
  let brandFilter = "TODOS";
  
  // Selections map: { cpu: productObj, motherboard: productObj, ... }
  let selections = {
    cpu: null,
    motherboard: null,
    cooler: null,
    ram: null,
    storage: null,
    gpu: null,
    psu: null,
    case: null,
    accessories: null
  };

  // Helper formatting function
  function formatMoney(amount) {
    return "$" + Math.floor(amount).toLocaleString("es-AR");
  }

  // Load Catalog from JSON with Fallback
  async function loadCatalogData() {
    try {
      const res = await fetch("component-comparator/catalog.example.json");
      if (!res.ok) throw new Error("Fetch catalog error");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        catalog = data;
        return;
      }
    } catch (e) {
      console.warn("[PCBuilder] Fetch failed, using embedded fallback catalog.", e);
    }
    catalog = DEFAULT_CATALOG;
  }

  // Initialize Configurator
  async function init() {
    rootEl = document.getElementById("pc-builder-root");
    if (!rootEl) return;

    await loadCatalogData();
    renderApp();
  }

  // Calculate current selected items list
  function getSelectedComponentsList() {
    return Object.values(selections).filter(Boolean);
  }

  // Calculate Subtotal
  function calculateSubtotal() {
    return Object.values(selections).reduce((sum, item) => sum + (item ? Number(item.price || 0) : 0), 0);
  }

  // Calculate Estimated Watts (CPU TDP + GPU TDP + 50W base)
  function calculateEstimatedWatts() {
    let cpuTdp = selections.cpu ? Number(selections.cpu.tdp || 0) : 0;
    let gpuTdp = selections.gpu ? Number(selections.gpu.tdp || 0) : 0;
    if (cpuTdp === 0 && gpuTdp === 0) return 0;
    return cpuTdp + gpuTdp + 50;
  }

  // Evaluate candidate product using CompatibilityEngine
  function evaluateProductState(product) {
    if (typeof window.CompatibilityEngine === "undefined") {
      return { state: "COMPATIBLE", reason: "" };
    }

    const currentList = getSelectedComponentsList();
    const result = window.CompatibilityEngine.evaluateCandidate(currentList, product);

    if (result.overallStatus === "INCOMPATIBLE" || (result.rulesEvaluated && result.rulesEvaluated.some(r => r.status === "INCOMPATIBLE"))) {
      const failRule = result.rulesEvaluated.find(r => r.status === "INCOMPATIBLE");
      return {
        state: "INCOMPATIBLE",
        reason: failRule ? failRule.message : "Incompatible con tu selección actual."
      };
    }

    if (result.overallStatus === "ADVERTENCIA" || (result.rulesEvaluated && result.rulesEvaluated.some(r => r.status === "ADVERTENCIA"))) {
      const warnRule = result.rulesEvaluated.find(r => r.status === "ADVERTENCIA");
      return {
        state: "ADVERTENCIA",
        reason: warnRule ? warnRule.message : "Advertencia de compatibilidad detectada."
      };
    }

    return { state: "COMPATIBLE", reason: "" };
  }

  // Render Full App Frame
  function renderApp() {
    if (!rootEl) return;

    rootEl.innerHTML = `
      <div class="ov-builder-container">
        <header class="ov-builder-header">
          <p class="eyebrow">CONFIGURADOR INTELIGENTE</p>
          <h2>ARMÁ TU <span>PC GAMER</span> PASO A PASO</h2>
          <p>Seleccioná componente por componente con verificación de compatibilidad física y eléctrica en tiempo real.</p>
        </header>

        <div class="ov-builder-layout">
          <!-- Sidebar Nav -->
          <aside class="ov-builder-sidebar" id="ovBuilderSidebar"></aside>

          <!-- Main Content View -->
          <main class="ov-builder-main" id="ovBuilderMain"></main>
        </div>

        <!-- Sticky Bottom Bar -->
        <div class="ov-builder-bottom-bar" id="ovBuilderBottomBar"></div>
      </div>
    `;

    renderSidebar();
    renderMainContent();
    renderBottomBar();
  }

  // Render Sidebar
  function renderSidebar() {
    const sidebarContainer = document.getElementById("ovBuilderSidebar");
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = `
      <div class="ov-builder-sidebar-title">
        <span>CATEGORÍAS</span>
        <span>${activeStepIndex + 1}/${BUILDER_STEPS.length}</span>
      </div>
      <ul class="ov-builder-steps-list" role="tablist">
        ${BUILDER_STEPS.map((step, idx) => {
          const isSelected = !!selections[step.key];
          const isActive = activeStepIndex === idx && !isSummaryView;
          const snippet = isSelected ? selections[step.key].name : (step.isOptional ? "Opcional" : "Pendiente");

          let classes = "ov-builder-step-item";
          if (isActive) classes += " is-active";
          if (isSelected) classes += " is-completed";

          return `
            <li class="${classes}" 
                role="tab" 
                aria-selected="${isActive ? 'true' : 'false'}"
                tabindex="0"
                data-step-index="${idx}">
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

    // Event listeners for step switching
    sidebarContainer.querySelectorAll(".ov-builder-step-item").forEach(item => {
      item.addEventListener("click", () => {
        const idx = Number(item.dataset.stepIndex);
        goToStep(idx);
      });
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const idx = Number(item.dataset.stepIndex);
          goToStep(idx);
        }
      });
    });
  }

  // Render Main Content Area
  function renderMainContent() {
    const mainContainer = document.getElementById("ovBuilderMain");
    if (!mainContainer) return;

    if (isSummaryView) {
      renderSummaryView(mainContainer);
      return;
    }

    const currentStep = BUILDER_STEPS[activeStepIndex];

    // Filter catalog products for this category
    let categoryProducts = catalog.filter(p => {
      const cat = p.category ? p.category.toLowerCase() : "";
      if (currentStep.key === "accessories") {
        return cat === "accessories" || cat === "perifericos" || cat === "monitores";
      }
      return cat === currentStep.key;
    });

    // Apply Brand Filter
    if (brandFilter !== "TODOS") {
      categoryProducts = categoryProducts.filter(p => {
        const brand = (p.brand || "").toUpperCase();
        const type = (p.type || "").toUpperCase();
        const socket = (p.socket || "").toUpperCase();
        const ramType = (p.ramType || "").toUpperCase();
        const filterUpper = brandFilter.toUpperCase();

        return brand.includes(filterUpper) || type.includes(filterUpper) || socket.includes(filterUpper) || ramType.includes(filterUpper);
      });
    }

    mainContainer.innerHTML = `
      <!-- Step Bar Header -->
      <div class="ov-builder-step-header">
        <div class="ov-builder-step-title-box">
          <h3>${activeStepIndex + 1}. SELECCIONÁ TU ${currentStep.label.toUpperCase()}</h3>
          <p>${currentStep.isOptional ? "Paso opcional. Podés elegir un accesorio o continuar al resumen." : "Elegí una opción compatible para continuar con tu armado."}</p>
        </div>

        <!-- Brand Chips -->
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

      <!-- Product Cards Grid -->
      <div class="ov-builder-grid">
        ${categoryProducts.length === 0 ? `
          <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--dim);">
            No hay productos disponibles para la marca seleccionada.
          </div>
        ` : categoryProducts.map(p => {
          const evalResult = evaluateProductState(p);
          const isSelected = selections[currentStep.key] && selections[currentStep.key].id === p.id;
          
          let cardClasses = "ov-builder-card";
          if (isSelected) cardClasses += " is-selected";
          if (evalResult.state === "INCOMPATIBLE") cardClasses += " is-incompatible";
          else if (evalResult.state === "ADVERTENCIA") cardClasses += " is-warning";
          else cardClasses += " is-compatible";

          return `
            <div class="${cardClasses}" data-id="${p.id}" tabindex="0">
              <div class="ov-builder-card-thumb">
                ${evalResult.state === "COMPATIBLE" ? `
                  <span class="ov-builder-card-badge badge-compatible">✓ Compatible</span>
                ` : evalResult.state === "INCOMPATIBLE" ? `
                  <span class="ov-builder-card-badge badge-incompatible">✕ Incompatible</span>
                ` : `
                  <span class="ov-builder-card-badge badge-warning">⚠️ Advertencia</span>
                `}
                <img src="${p.img || 'assets/flash_gpu.png'}" alt="${p.name}" />
              </div>

              <h4 class="ov-builder-card-name">${p.name}</h4>

              ${evalResult.reason ? `
                <div class="ov-builder-reason-banner ${evalResult.state === 'ADVERTENCIA' ? 'banner-warning' : ''}">
                  ${evalResult.reason}
                </div>
              ` : ''}

              <div class="ov-builder-card-footer">
                <span class="ov-builder-card-price">${formatMoney(p.price)}</span>
                <button class="ov-builder-card-btn">
                  ${isSelected ? "✓ ELEGIDO" : "SELECCIONAR"}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Event Listeners for Brand Chips
    mainContainer.querySelectorAll(".ov-brand-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        brandFilter = chip.dataset.brand;
        renderMainContent();
      });
    });

    // Event Listeners for Product Selection Cards
    mainContainer.querySelectorAll(".ov-builder-card").forEach(card => {
      const productId = card.dataset.id;
      const productObj = categoryProducts.find(p => p.id === productId);

      const handleSelect = () => {
        const evalResult = evaluateProductState(productObj);
        if (evalResult.state === "INCOMPATIBLE") {
          // If incompatible, toggle/highlight reason
          return;
        }

        // Toggle selection
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

  // Render Bottom Sticky Controls Bar
  function renderBottomBar() {
    const barContainer = document.getElementById("ovBuilderBottomBar");
    if (!barContainer) return;

    const subtotal = calculateSubtotal();
    const watts = calculateEstimatedWatts();
    const isLastStep = activeStepIndex === BUILDER_STEPS.length - 1;
    const hasSelectionInStep = !!selections[BUILDER_STEPS[activeStepIndex]?.key];

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
            <button class="ov-btn-cyber btn-secondary" id="ovBtnPrev">
              <span>◀ VOLVER</span>
            </button>
          ` : ''}

          ${!isSummaryView ? `
            <button class="ov-btn-cyber btn-secondary" id="ovBtnSkip">
              <span>SALTAR PASO</span>
            </button>

            <button class="ov-btn-cyber btn-accent" id="ovBtnNext">
              <span>${isLastStep ? "VER RESUMEN DEL ARMADO ➔" : (hasSelectionInStep ? "SIGUIENTE ➔" : "SIGUIENTE (SALTAR) ➔")}</span>
            </button>
          ` : `
            <button class="ov-btn-cyber btn-accent" id="ovBtnAddToCart">
              <span>🛒 AGREGAR ARMADO AL CARRITO</span>
            </button>
          `}
        </div>
      </div>
    `;

    // Bottom Bar Event Listeners
    const btnPrev = document.getElementById("ovBtnPrev");
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        if (isSummaryView) {
          isSummaryView = false;
          activeStepIndex = BUILDER_STEPS.length - 1;
        } else if (activeStepIndex > 0) {
          activeStepIndex--;
          brandFilter = "TODOS";
        }
        renderSidebar();
        renderMainContent();
        renderBottomBar();
        window.scrollTo({ top: rootEl.offsetTop - 80, behavior: "smooth" });
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

  // Advance to next step or summary
  function advanceStep() {
    if (activeStepIndex < BUILDER_STEPS.length - 1) {
      activeStepIndex++;
      brandFilter = "TODOS";
    } else {
      isSummaryView = true;
    }
    renderSidebar();
    renderMainContent();
    renderBottomBar();
    
    if (rootEl) {
      const targetTop = rootEl.getBoundingClientRect().top + window.pageYOffset - 80;
      if (Math.abs(window.pageYOffset - targetTop) > 100) {
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    }
  }

  // Jump directly to step
  function goToStep(index) {
    if (index >= 0 && index < BUILDER_STEPS.length) {
      activeStepIndex = index;
      isSummaryView = false;
      brandFilter = "TODOS";
      renderSidebar();
      renderMainContent();
      renderBottomBar();

      if (rootEl) {
        const targetTop = rootEl.getBoundingClientRect().top + window.pageYOffset - 80;
        if (Math.abs(window.pageYOffset - targetTop) > 100) {
          window.scrollTo({ top: targetTop, behavior: "smooth" });
        }
      }
    }
  }

  // Render Final Summary View
  function renderSummaryView(container) {
    const selectedList = getSelectedComponentsList();
    const subtotal = calculateSubtotal();
    const watts = calculateEstimatedWatts();

    // Evaluate Global Compatibility with CompatibilityEngine
    let globalReport = { overallStatus: "COMPATIBLE", rulesEvaluated: [] };
    if (typeof window.CompatibilityEngine !== "undefined") {
      globalReport = window.CompatibilityEngine.checkAllCompatibility(selectedList);
    }

    container.innerHTML = `
      <div class="ov-builder-summary">
        <div class="ov-builder-summary-header">
          <h3>RESUMEN DE TU ARMADO GAMER</h3>
          <button class="ov-summary-edit-btn" id="ovEditBuildBtn">✎ EDITAR SELECCIÓN</button>
        </div>

        <!-- Component List Table -->
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
                      <span style="color: var(--dim); font-style: italic;">Sin seleccionar (Salteado)</span>
                    `}
                  </td>
                  <td class="ov-summary-item-price">
                    ${item ? formatMoney(item.price) : "-"}
                  </td>
                  <td>
                    <button class="ov-summary-edit-btn" data-step-idx="${idx}">Cambiar</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- Technical Report -->
        <div class="ov-summary-report-box">
          <h4>INFORME TÉCNICO DE COMPATIBILIDAD GLOBAL</h4>
          ${globalReport.rulesEvaluated.length === 0 ? `
            <p style="color: var(--dim); margin:0; font-size: 13px;">No se evaluaron reglas (se requieren al menos 2 componentes clave).</p>
          ` : `
            <div class="ov-summary-rules-list">
              ${globalReport.rulesEvaluated.map(r => `
                <div class="ov-rule-card ${r.status === 'COMPATIBLE' ? 'rule-compatible' : (r.status === 'INCOMPATIBLE' ? 'rule-incompatible' : 'rule-warning')}">
                  <div>${r.status === 'COMPATIBLE' ? '✓' : (r.status === 'INCOMPATIBLE' ? '✕' : '⚠️')}</div>
                  <div>
                    <strong>${r.ruleName}:</strong> ${r.message}
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Total Bar -->
        <div class="ov-summary-total-bar">
          <div>
            <div class="ov-summary-total-label">SUBTOTAL COMPONENTES + ARMADO & TESTEO GRATIS</div>
            <div class="ov-summary-total-price">${formatMoney(subtotal)}</div>
          </div>

          <button class="ov-btn-cyber btn-accent" id="ovSummaryAddToCartBtn">
            <span>🛒 AGREGAR TODO AL CARRITO DE COMPRAS</span>
          </button>
        </div>
      </div>
    `;

    // Add event listeners for editing steps
    container.querySelectorAll(".ov-summary-edit-btn[data-step-idx]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.stepIdx);
        goToStep(idx);
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

  // Add all selected components to OVERVOLT shopping cart
  function addToCartBuild() {
    const selectedList = getSelectedComponentsList();
    if (selectedList.length === 0) {
      if (typeof window.showNotificationToast === "function") {
        window.showNotificationToast("SYS_WARN", "NO HAY COMPONENTES SELECCIONADOS");
      } else {
        alert("Seleccioná al menos un componente para agregar al carrito.");
      }
      return;
    }

    // Push each item to global cart
    selectedList.forEach(item => {
      if (typeof window.addToCart === "function") {
        window.addToCart(item.id, item.name, item.price, item.img || 'assets/flash_gpu.png', item.category || 'Componentes', 1);
      }
    });

    // Notify user
    if (typeof window.showNotificationToast === "function") {
      window.showNotificationToast("SYS_OK", "¡ARMADO COMPLETO AGREGADO AL CARRITO!");
    }

    // Open Cart Drawer if openCart function exists
    if (typeof window.openCart === "function") {
      window.openCart();
    }
  }

  // Auto-initialize on DOMReady
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

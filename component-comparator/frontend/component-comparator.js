/**
 * PC Component Comparator Plugin - Frontend Logic
 * Reusable, Vanilla JS, Cyberpunk Theme, Keyboard Accessible
 */

(function () {
  let apiUrl = "https://overvolt-compatibility-engine.onrender.com";
  let mountEl = null;
  let selectedIds = [];
  let allComponentsCache = null;
  let isModalOpen = false;

  // Session storage sync key
  const STORAGE_KEY = "overvolt_compare_selection";

  // Elements references
  let floatingBarEl = null;
  let modalEl = null;
  let backdropEl = null;
  let previouslyFocusedEl = null;

  // Toast notification system
  function showToast(message) {
    let container = document.getElementById("cc-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "cc-toast-container";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "cc-toast";
    toast.innerHTML = `<span class="cc-toast-decor"></span><span class="cc-toast-text">${message}</span>`;
    container.appendChild(toast);

    // Slide in
    setTimeout(() => toast.classList.add("visible"), 10);
    // Remove after 3.5s
    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // Fetch all components to cache specs
  async function fetchComponentsOnce() {
    if (allComponentsCache) return allComponentsCache;
    try {
      const res = await fetch(`${apiUrl}/api/components`);
      if (!res.ok) throw new Error("Error cargando catálogo.");
      allComponentsCache = await res.json();
      return allComponentsCache;
    } catch (err) {
      console.error("[Comparator Plugin] Error fetching catalog:", err);
      return [];
    }
  }

  // Load selection from storage
  function loadSelection() {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        selectedIds = JSON.parse(stored);
      }
    } catch (e) {
      selectedIds = [];
    }
  }

  // Save selection to storage
  function saveSelection() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    } catch (e) {
      // Ignore storage blockages
    }
  }

  // Sync checkboxes present in the DOM
  function syncCheckboxes() {
    document.querySelectorAll(".cc-compare-checkbox-input").forEach(cb => {
      const cid = cb.dataset.id;
      cb.checked = selectedIds.includes(cid);
    });
  }

  // Generate floating bottom bar HTML
  function renderFloatingBar(catalog) {
    if (!floatingBarEl) return;

    if (selectedIds.length < 2) {
      floatingBarEl.classList.remove("visible");
      return;
    }

    const items = selectedIds
      .map(id => catalog.find(c => c.id === id))
      .filter(Boolean);

    let itemsHtml = "";
    items.forEach(item => {
      itemsHtml += `
        <div class="cc-bar-item" data-id="${item.id}">
          <img src="${item.img || 'assets/flash_cpu.png'}" alt="${item.name}" class="cc-bar-img" />
          <span class="cc-bar-name">${item.name}</span>
          <button class="cc-bar-remove-btn" data-id="${item.id}" aria-label="Quitar ${item.name}">&times;</button>
        </div>
      `;
    });

    floatingBarEl.innerHTML = `
      <div class="cc-bar-content">
        <div class="cc-bar-left">
          <div class="cc-bar-title">COMPARADOR <span class="cc-glow-text">[${selectedIds.length}/4]</span></div>
          <div class="cc-bar-items">${itemsHtml}</div>
        </div>
        <div class="cc-bar-right">
          <button class="cc-compare-btn cc-btn-cyber" id="ccBarCompareBtn">
            <span>COMPARAR</span>
          </button>
          <button class="cc-bar-clear-btn" id="ccBarClearBtn" aria-label="Limpiar selección">LIMPIAR</button>
        </div>
      </div>
    `;

    floatingBarEl.classList.add("visible");

    // Add listeners inside floating bar
    document.getElementById("ccBarCompareBtn").addEventListener("click", () => ComponentComparator.open());
    document.getElementById("ccBarClearBtn").addEventListener("click", () => {
      selectedIds = [];
      saveSelection();
      syncCheckboxes();
      renderFloatingBar(catalog);
    });
    floatingBarEl.querySelectorAll(".cc-bar-remove-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        ComponentComparator.remove(id);
      });
    });
  }

  // Injects DOM elements
  function injectDOMElements() {
    // Inject floating bottom bar container
    let existingBar = document.getElementById("cc-floating-bar");
    if (!existingBar) {
      floatingBarEl = document.createElement("div");
      floatingBarEl.id = "cc-floating-bar";
      floatingBarEl.className = "cc-floating-bar";
      mountEl.appendChild(floatingBarEl);
    } else {
      floatingBarEl = existingBar;
    }

    // Inject modal overlay container
    let existingModal = document.getElementById("cc-compare-modal");
    if (!existingModal) {
      modalEl = document.createElement("div");
      modalEl.id = "cc-compare-modal";
      modalEl.className = "cc-compare-modal";
      modalEl.setAttribute("role", "dialog");
      modalEl.setAttribute("aria-modal", "true");
      modalEl.setAttribute("aria-hidden", "true");
      modalEl.tabIndex = -1;
      
      backdropEl = document.createElement("div");
      backdropEl.className = "cc-modal-backdrop";
      
      mountEl.appendChild(backdropEl);
      mountEl.appendChild(modalEl);

      // Close events
      backdropEl.addEventListener("click", () => ComponentComparator.close());
    } else {
      modalEl = existingModal;
      backdropEl = document.querySelector(".cc-modal-backdrop") || document.createElement("div");
    }
  }

  // Renders the comparison modal content
  async function renderModalContent(catalog) {
    if (!modalEl) return;

    if (selectedIds.length === 0) {
      modalEl.innerHTML = `
        <div class="cc-modal-header">
          <h2 class="cc-glow-text">SISTEMA CONFIGURADOR</h2>
          <button class="cc-modal-close" id="ccModalCloseBtn" aria-label="Cerrar modal">&times;</button>
        </div>
        <div class="cc-modal-body">
          <div class="cc-empty-container">
            <div class="cc-empty-icon">⚡</div>
            <h3 class="cc-empty-title cc-glow-text">COMPATIBILIDAD DE HARDWARE</h3>
            <p class="cc-empty-desc">
              No has seleccionado ningún componente todavía. Para armar tu equipo a medida y verificar la compatibilidad física y eléctrica en tiempo real, ve a la tienda y presiona el botón <strong>"COMPARAR"</strong> en los componentes de hardware (puedes elegir hasta 4).
            </p>
            <div class="cc-empty-steps">
              <div class="cc-empty-step">
                <span class="cc-step-num">1</span>
                <span class="cc-step-text">Selecciona un Procesador (CPU)</span>
              </div>
              <div class="cc-empty-step">
                <span class="cc-step-num">2</span>
                <span class="cc-step-text">Selecciona una Placa Madre compatible</span>
              </div>
              <div class="cc-empty-step">
                <span class="cc-step-num">3</span>
                <span class="cc-step-text">Agrega RAM, Placa de Video, Gabinete, Fuente y Almacenamiento</span>
              </div>
            </div>
            <button class="cc-btn-cyber cc-empty-cta-btn" id="ccEmptyCtaBtn">
              <span>IR A COMPONENTES</span>
            </button>
          </div>
        </div>
      `;
      document.getElementById("ccModalCloseBtn").addEventListener("click", () => ComponentComparator.close());
      document.getElementById("ccEmptyCtaBtn").addEventListener("click", () => {
        ComponentComparator.close();
        if (!window.location.pathname.includes("categoria.html")) {
          window.location.href = "categoria.html?cat=Componentes";
        }
      });
      return;
    }

    // Initial Loading HUD state
    modalEl.innerHTML = `
      <div class="cc-modal-header">
        <h2 class="cc-glow-text">SISTEMA DE COMPARACIÓN</h2>
        <button class="cc-modal-close" id="ccModalCloseBtn" aria-label="Cerrar modal">&times;</button>
      </div>
      <div class="cc-modal-loading">
        <div class="cc-hud-spinner"></div>
        <div class="cc-hud-loading-text">ANALIZANDO COMPATIBILIDAD<span class="cc-blink-dot">.</span><span class="cc-blink-dot" style="animation-delay: 0.2s">.</span><span class="cc-blink-dot" style="animation-delay: 0.4s">.</span></div>
      </div>
    `;

    document.getElementById("ccModalCloseBtn").addEventListener("click", () => ComponentComparator.close());

    const items = selectedIds
      .map(id => catalog.find(c => c.id === id))
      .filter(Boolean);

    try {
      // Call compatibility engine endpoint
      const response = await fetch(`${apiUrl}/api/compatibility/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds })
      });

      if (!response.ok) throw new Error("El servidor de compatibilidad no respondió.");

      const result = await response.json();

      // Build Comparison Table specs fields based on components categories
      const categoriesInSelection = new Set(items.map(i => i.category));

      // Define rows
      const specRows = [
        { label: "Marca", key: "brand" },
        { label: "Categoría", key: "category", mapper: val => val.toUpperCase() },
        { label: "Precio", key: "price", mapper: val => `$${val.toLocaleString()}` }
      ];

      // Sockets
      if (categoriesInSelection.has("cpu") || categoriesInSelection.has("motherboard") || categoriesInSelection.has("cooler")) {
        specRows.push({
          label: "Socket / Compatibilidad",
          evaluator: item => {
            if (item.category === "cpu" || item.category === "motherboard") return item.socket || "—";
            if (item.category === "cooler") return item.supportedSockets ? item.supportedSockets.join(", ") : "—";
            return "—";
          }
        });
      }

      // Chipset / Generación
      if (categoriesInSelection.has("cpu") || categoriesInSelection.has("motherboard")) {
        specRows.push({
          label: "Chipset / Generación",
          evaluator: item => {
            if (item.category === "cpu") return item.generation || "—";
            if (item.category === "motherboard") return item.chipset || "—";
            return "—";
          }
        });
      }

      // Memory (RAM)
      if (categoriesInSelection.has("ram") || categoriesInSelection.has("motherboard")) {
        specRows.push({
          label: "Tipo de Memoria (RAM)",
          evaluator: item => {
            if (item.category === "ram" || item.category === "motherboard") return item.ramType || "—";
            return "—";
          }
        });
        specRows.push({
          label: "Velocidad de RAM",
          evaluator: item => {
            if (item.category === "ram") return item.speed ? `${item.speed}MHz` : "—";
            if (item.category === "motherboard") return item.maxRamSpeed ? `Soporta hasta ${item.maxRamSpeed}MHz` : "—";
            return "—";
          }
        });
      }

      // GPU & Case sizes
      if (categoriesInSelection.has("gpu") || categoriesInSelection.has("case")) {
        specRows.push({
          label: "Longitud de GPU",
          evaluator: item => {
            if (item.category === "gpu") return item.lengthMm ? `${item.lengthMm}mm` : "—";
            if (item.category === "case") return item.maxGpuLengthMm ? `Soporta hasta ${item.maxGpuLengthMm}mm` : "—";
            return "—";
          }
        });
      }

      // Power / Certifications
      if (categoriesInSelection.has("psu") || categoriesInSelection.has("gpu") || categoriesInSelection.has("cpu")) {
        specRows.push({
          label: "TDP / Potencia",
          evaluator: item => {
            if (item.category === "cpu" || item.category === "gpu") return item.tdp ? `${item.tdp}W` : "—";
            if (item.category === "psu") return item.wattage ? `${item.wattage}W` : "—";
            return "—";
          }
        });
      }
      if (categoriesInSelection.has("psu")) {
        specRows.push({
          label: "Certificación 80 Plus",
          evaluator: item => item.category === "psu" ? item.certification || "—" : "—"
        });
      }

      // Form Factors
      if (categoriesInSelection.has("motherboard") || categoriesInSelection.has("case")) {
        specRows.push({
          label: "Factor de Forma",
          evaluator: item => {
            if (item.category === "motherboard") return item.formFactor || "—";
            if (item.category === "case") return item.formFactors ? item.formFactors.join(", ") : "—";
            return "—";
          }
        });
      }

      // Storage interfaces
      if (categoriesInSelection.has("storage") || categoriesInSelection.has("motherboard")) {
        specRows.push({
          label: "Interfaz de Almacenamiento",
          evaluator: item => {
            if (item.category === "storage") return item.interface || "—";
            if (item.category === "motherboard") return item.m2Slots ? `${item.m2Slots} slots M.2 disponibles` : "—";
            return "—";
          }
        });
      }

      // Cooler Heights
      if (categoriesInSelection.has("cooler") || categoriesInSelection.has("case")) {
        specRows.push({
          label: "Altura de Cooler",
          evaluator: item => {
            if (item.category === "cooler") return item.heightMm ? `${item.heightMm}mm` : "—";
            if (item.category === "case") return item.maxCoolerHeightMm ? `Soporta hasta ${item.maxCoolerHeightMm}mm` : "—";
            return "—";
          }
        });
      }

      // Render overall compatibility banner
      let bannerClass = "cc-banner-compatible";
      let bannerText = "SISTEMAS COMPATIBLES";
      if (result.overallStatus === "INCOMPATIBLE") {
        bannerClass = "cc-banner-incompatible";
        bannerText = "INCOMPATIBILIDAD DETECTADA";
      } else if (result.overallStatus === "ADVERTENCIA") {
        bannerClass = "cc-banner-warning";
        bannerText = "ADVERTENCIAS DE CONFIGURACIÓN";
      } else if (result.overallStatus === "NO EVALUABLE") {
        bannerClass = "cc-banner-unevaluable";
        bannerText = "REGLAS NO EVALUABLES (FALTAN DATOS)";
      }

      // Build table header columns
      let tableHeaderHtml = "<th>Especificaciones</th>";
      items.forEach(item => {
        tableHeaderHtml += `
          <th>
            <div class="cc-th-item">
              <img src="${item.img || 'assets/flash_cpu.png'}" alt="${item.name}" class="cc-table-img" />
              <div class="cc-th-name">${item.name}</div>
              <button class="cc-table-remove-btn" data-id="${item.id}">Quitar</button>
            </div>
          </th>
        `;
      });

      // Build table rows
      let tableBodyHtml = "";
      specRows.forEach(row => {
        tableBodyHtml += `<tr><td class="cc-td-label">${row.label}</td>`;
        items.forEach(item => {
          let val = "—";
          if (row.evaluator) {
            val = row.evaluator(item);
          } else if (row.key) {
            val = item[row.key] !== undefined ? item[row.key] : "—";
            if (row.mapper && val !== "—") {
              val = row.mapper(val);
            }
          }
          tableBodyHtml += `<td>${val}</td>`;
        });
        tableBodyHtml += `</tr>`;
      });

      // Build rules evaluation details
      let rulesHtml = "";
      if (result.rulesEvaluated && result.rulesEvaluated.length > 0) {
        result.rulesEvaluated.forEach(r => {
          let icon = "✔";
          let rowClass = "cc-rule-compatible";
          if (r.status === "INCOMPATIBLE") {
            icon = "✖";
            rowClass = "cc-rule-incompatible";
          } else if (r.status === "ADVERTENCIA") {
            icon = "⚠";
            rowClass = "cc-rule-warning";
          } else if (r.status === "NO EVALUABLE") {
            icon = "🛈";
            rowClass = "cc-rule-unevaluable";
          }
          rulesHtml += `
            <div class="cc-rule-item ${rowClass}">
              <span class="cc-rule-icon">${icon}</span>
              <div class="cc-rule-info">
                <span class="cc-rule-title">${r.ruleName}</span>
                <span class="cc-rule-msg">${r.message}</span>
              </div>
            </div>
          `;
        });
      }

      modalEl.innerHTML = `
        <div class="cc-modal-header">
          <h2 class="cc-glow-text">ANÁLISIS DE COMPATIBILIDAD</h2>
          <button class="cc-modal-close" id="ccModalCloseBtn" aria-label="Cerrar modal">&times;</button>
        </div>
        <div class="cc-modal-body">
          <div class="cc-compat-banner ${bannerClass}">
            <div class="cc-banner-decor"></div>
            <span>${bannerText}</span>
          </div>

          <div class="cc-table-wrapper">
            <table class="cc-compare-table">
              <thead>
                <tr>${tableHeaderHtml}</tr>
              </thead>
              <tbody>
                ${tableBodyHtml}
              </tbody>
            </table>
          </div>

          <div class="cc-compatibility-details">
            <h3 class="cc-glow-text">INFORME TÉCNICO DE REGLAS</h3>
            <div class="cc-rules-list">
              ${rulesHtml || '<p class="cc-empty-text">No hay reglas de compatibilidad evaluadas para esta selección.</p>'}
            </div>
          </div>
        </div>
      `;

      // Re-attach close listeners
      document.getElementById("ccModalCloseBtn").addEventListener("click", () => ComponentComparator.close());

      // Remove item buttons inside table
      modalEl.querySelectorAll(".cc-table-remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const id = e.target.dataset.id;
          ComponentComparator.remove(id);
          // Re-render modal in place
          renderModalContent(catalog);
        });
      });

      // Trap focus
      trapFocus();

    } catch (err) {
      console.error(err);
      modalEl.innerHTML = `
        <div class="cc-modal-header">
          <h2 class="cc-glow-text">SISTEMA ERROR</h2>
          <button class="cc-modal-close" id="ccModalCloseBtn" aria-label="Cerrar modal">&times;</button>
        </div>
        <div class="cc-modal-body">
          <div class="cc-error-container">
            <p class="cc-error-title">ERROR DE CONEXIÓN AL MOTOR</p>
            <p class="cc-error-desc">El backend de compatibilidad no está disponible temporalmente. Por favor, asegúrate de que el servidor esté activo.</p>
            <button class="cc-btn-cyber" id="ccRetryBtn"><span>REINTENTAR</span></button>
          </div>
        </div>
      `;
      document.getElementById("ccModalCloseBtn").addEventListener("click", () => ComponentComparator.close());
      document.getElementById("ccRetryBtn").addEventListener("click", () => renderModalContent(catalog));
    }
  }

  // Keyboard Accessibility - Focus Trap
  function trapFocus() {
    if (!modalEl) return;
    const focusableElementsString = 'button, [href], input, select, textarea, [tabindex="0"]';
    const focusableElements = modalEl.querySelectorAll(focusableElementsString);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Reset and focus first element
    firstElement.focus();

    modalEl.onkeydown = function (e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      } else if (e.key === "Escape") {
        ComponentComparator.close();
      }
    };
  }

  // Handle keyboard events when modal is open
  function globalKeydownHandler(e) {
    if (e.key === "Escape" && isModalOpen) {
      ComponentComparator.close();
    }
  }

  // PUBLIC API INTERFACE
  window.ComponentComparator = {
    async init(options = {}) {
      if (options.apiUrl) apiUrl = options.apiUrl;
      
      // Override themes if provided (custom css custom properties)
      if (options.theme) {
        const root = document.documentElement;
        Object.keys(options.theme).forEach(key => {
          root.style.setProperty(`--cc-${key}`, options.theme[key]);
        });
      }

      mountEl = options.mountSelector ? document.querySelector(options.mountSelector) : null;
      if (!mountEl) {
        // Fallback mount container
        let root = document.getElementById("comparator-root");
        if (!root) {
          root = document.createElement("div");
          root.id = "comparator-root";
          document.body.appendChild(root);
        }
        mountEl = root;
      }

      // Load initial storage selection
      loadSelection();

      // Inject DOM elements
      injectDOMElements();

      // Register keydown handler immediately
      window.addEventListener("keydown", globalKeydownHandler);

      // Catch any click on buttons/links for building a PC immediately
      document.addEventListener("click", (e) => {
        const target = e.target.closest("a");
        if (!target) return;
        
        const href = target.getAttribute("href") || "";
        const text = target.innerText.trim().toLowerCase();
        
        if (
          href === "#build-pc" || 
          href === "index.html#build-pc" || 
          text.includes("armá tu pc") || 
          text.includes("armar pc") ||
          text.includes("empezar a armar") ||
          text.includes("empezar a construir")
        ) {
          e.preventDefault();
          ComponentComparator.open();
        }
      });

      // Event delegation for checkbox changes registered immediately
      document.addEventListener("change", (e) => {
        // Direct binding for #build-pc links
        document.querySelectorAll('a[href="#build-pc"]').forEach(link => {
          link.addEventListener('click', e => {
            e.preventDefault();
            ComponentComparator.open();
          });
        });
        if (e.target.classList.contains("cc-compare-checkbox-input")) {
          const id = e.target.dataset.id;
          if (e.target.checked) {
            this.add(id);
          } else {
            this.remove(id);
          }
        }
      });

      // Automatically inject compare checkboxes on all .product-card elements
      function injectCheckboxesOnCards() {
        document.querySelectorAll(".product-card").forEach(card => {
          if (card.querySelector(".cc-compare-checkbox")) return;

          let productId = card.dataset.id;
          if (!productId) {
            const wishlistBtn = card.querySelector(".wishlist-heart-btn");
            if (wishlistBtn) productId = wishlistBtn.dataset.id;
          }
          if (!productId) {
            const addToCartBtn = card.querySelector("[data-id]");
            if (addToCartBtn) productId = addToCartBtn.dataset.id;
          }

          if (productId) {
            const thumb = card.querySelector(".product-thumb");
            if (thumb) {
              const label = document.createElement("label");
              label.className = "cc-compare-checkbox";
              label.setAttribute("aria-label", "Comparar producto");
              label.innerHTML = `
                <input type="checkbox" class="cc-compare-checkbox-input" data-id="${productId}" />
                <span class="cc-compare-checkbox-box"></span>
                <span class="cc-compare-checkbox-text">COMPARAR</span>
              `;
              thumb.appendChild(label);
            }
          }
        });
      }

      injectCheckboxesOnCards();

      // Synchronize changes when elements render dynamically
      const observer = new MutationObserver(() => {
        injectCheckboxesOnCards();
        syncCheckboxes();
      });
      observer.observe(document.body, { childList: true, subtree: true });

      // Connect click handler to header comparison trigger if it exists
      const headerBtn = document.getElementById("ccHeaderCompareBtn");
      if (headerBtn) {
        headerBtn.addEventListener("click", () => {
          if (selectedIds.length < 2) {
            showToast("Selecciona al menos 2 componentes para comparar.");
            return;
          }
          ComponentComparator.open();
        });
      }

      // Fetch the catalog in the background to sync UI without blocking other init operations
      fetchComponentsOnce().then(catalog => {
        syncCheckboxes();
        renderFloatingBar(catalog);
      }).catch(err => {
        console.error("[ComponentComparator] Error in background fetch:", err);
      });

      console.log("[ComponentComparator] Initialized successfully.");
    },

    async add(productId) {
      if (selectedIds.includes(productId)) return;

      if (selectedIds.length >= 4) {
        showToast("Límite alcanzado: Máximo 4 componentes en comparación.");
        syncCheckboxes(); // Untoggle
        return;
      }

      selectedIds.push(productId);
      saveSelection();
      syncCheckboxes();

      const catalog = await fetchComponentsOnce();
      renderFloatingBar(catalog);
    },

    async remove(productId) {
      selectedIds = selectedIds.filter(id => id !== productId);
      saveSelection();
      syncCheckboxes();

      const catalog = await fetchComponentsOnce();
      renderFloatingBar(catalog);

      if (isModalOpen && selectedIds.length === 0) {
        this.close();
      }
    },

    async open() {
      if (isModalOpen) return;
      isModalOpen = true;

      // Save previously focused element for accessibility
      previouslyFocusedEl = document.activeElement;

      // Make visible
      backdropEl.classList.add("visible");
      modalEl.classList.add("visible");
      modalEl.setAttribute("aria-hidden", "false");

      // Load content
      const catalog = await fetchComponentsOnce();
      await renderModalContent(catalog);
    },

    close() {
      if (!isModalOpen) return;
      isModalOpen = false;

      backdropEl.classList.remove("visible");
      modalEl.classList.remove("visible");
      modalEl.setAttribute("aria-hidden", "true");

      // Return focus to trigger button
      if (previouslyFocusedEl) {
        previouslyFocusedEl.focus();
      }
    },

    getSelection() {
      return [...selectedIds];
    }
  };
})();

// ============================================================
// OVERVOLT — Ecommerce Gamer Core Script
// ============================================================

// 1. MOCK PRODUCT DATABASE
const PRODUCTS_DB = [
  {
    id: "flash-gpu",
    name: "Placa de Video Zenith RTX 4070 Ti 12GB",
    category: "Placas de Video",
    brand: "ZENITH",
    price: 789999,
    oldPrice: 980000,
    img: "assets/flash_gpu.png",
    images: ["assets/flash_gpu.png", "assets/slide_gpu.png", "assets/duo_monitores.png"],
    specs: { "Chipset": "NVIDIA RTX 4070 Ti", "Memoria VRAM": "12GB GDDR6X", "Reloj Base": "2.31 GHz", "Consumo TDP": "285W" },
    socket: "PCIe 4.0",
    stock: "En Stock",
    stockNum: 3
  },
  {
    id: "flash-cpu",
    name: "Procesador AMD Ryzen 7 7800X3D",
    category: "Procesadores",
    brand: "RAPTIX",
    price: 469999,
    oldPrice: 580000,
    img: "assets/flash_cpu.png",
    images: ["assets/flash_cpu.png", "assets/flash_cooler.svg", "assets/flash_mobo.png"],
    specs: { "Núcleos/Hilos": "8 / 16", "Frecuencia Máxima": "5.0 GHz", "Socket": "AM5", "Caché L3": "96MB" },
    socket: "AM5",
    stock: "En Stock",
    stockNum: 8
  },
  {
    id: "flash-mouse",
    name: "Mouse Inalámbrico Voltek Pro",
    category: "Perifericos",
    brand: "VOLTEK",
    price: 59999,
    oldPrice: 85000,
    img: "assets/flash_mouse.png",
    images: ["assets/flash_mouse.png", "assets/duo_perifericos.png", "assets/slide_perifericos.png"],
    specs: { "Sensor": "Optical 26K DPI", "Autonomía": "80 Horas", "Conectividad": "Wireless 2.4Ghz + BT", "Peso": "63g" },
    socket: "USB-C",
    stock: "En Stock",
    stockNum: 2
  },
  {
    id: "flash-headset",
    name: "Auriculares Hypergen RGB",
    category: "Perifericos",
    brand: "RAPTIX",
    price: 79999,
    oldPrice: 110000,
    img: "assets/flash_headset.png",
    images: ["assets/flash_headset.png", "assets/slide_perifericos.png", "assets/duo_perifericos.png"],
    specs: { "Driver": "50mm Neodimio", "Sonido": "7.1 Envolvente", "Micrófono": "Retráctil con cancelación", "RGB": "Personalizable" },
    socket: "USB",
    stock: "En Stock",
    stockNum: 3
  },
  {
    id: "flash-mobo",
    name: "Motherboard Voltek B650 Wifi",
    category: "Componentes",
    brand: "VOLTEK",
    price: 199999,
    oldPrice: 260000,
    img: "assets/flash_mobo.png",
    images: ["assets/flash_mobo.png", "assets/flash_cpu.png", "assets/flash_cooler.svg"],
    specs: { "Socket": "AM5", "Chipset": "AMD B650", "Slots RAM": "4x DDR5", "Conectividad": "Wi-Fi 6E + BT 5.2" },
    socket: "AM5",
    stock: "En Stock",
    stockNum: 6
  },
  {
    id: "flash-keyboard",
    name: "Teclado Mecánico Raptix Pro",
    category: "Perifericos",
    brand: "RAPTIX",
    price: 99999,
    oldPrice: 140000,
    img: "assets/flash_keyboard.png",
    images: ["assets/flash_keyboard.png", "assets/duo_perifericos.png", "assets/slide_perifericos.png"],
    specs: { "Switches": "Mechanical Red Linear", "Layout": "Español ISO", "RGB": "Por tecla 16.8M colores", "Construcción": "Aluminio" },
    socket: "USB-C",
    stock: "En Stock",
    stockNum: 10
  },
  {
    id: "flash-monitor",
    name: "Monitor Nexcore 27\" QHD 165Hz",
    category: "Monitores",
    brand: "NEXCORE",
    price: 349999,
    oldPrice: 450000,
    img: "assets/flash_monitor.png",
    images: ["assets/flash_monitor.png", "assets/duo_monitores.png"],
    specs: { "Tamaño": "27 Pulgadas", "Resolución": "QHD (2560x1440)", "Tasa Refresco": "165Hz", "Panel": "Fast IPS 1ms" },
    socket: "DP + HDMI",
    stock: "En Stock",
    stockNum: 4
  },
  {
    id: "cool-1",
    name: "Cooler Líquido 360mm Voltek",
    category: "Componentes",
    brand: "VOLTEK",
    price: 164999,
    oldPrice: 210000,
    img: "assets/flash_cooler.svg",
    images: ["assets/flash_cooler.svg", "assets/flash_cpu.png", "assets/flash_mobo.png"],
    specs: { "Radiador": "360mm Aluminio", "Ventiladores": "3x 120mm ARGB PWM", "Compatibilidad": "AM4 / AM5 / LGA1700" },
    socket: "LGA1700",
    stock: "En Stock",
    stockNum: 5
  },
  {
    id: "ram-1",
    name: "Memoria RAM DDR5 32GB Kit (2x16GB)",
    category: "Componentes",
    brand: "NEXCORE",
    price: 189999,
    img: "assets/flash_ram.svg",
    images: ["assets/flash_ram.svg", "assets/flash_ssd.svg"],
    specs: { "Capacidad": "32GB (2x16GB)", "Velocidad": "6000 MHz", "Latencia": "CL30", "Voltaje": "1.35V" },
    socket: "DDR5",
    stock: "En Stock",
    stockNum: 15
  },
  {
    id: "ssd-1",
    name: "SSD NVMe M.2 PCIe 4.0 2TB Zenith",
    category: "Componentes",
    brand: "ZENITH",
    price: 224999,
    img: "assets/flash_ssd.svg",
    images: ["assets/flash_ssd.svg", "assets/flash_ram.svg"],
    specs: { "Capacidad": "2TB", "Lectura": "7400 MB/s", "Escritura": "6800 MB/s", "Formato": "M.2 2280" },
    socket: "PCIe 4.0",
    stock: "En Stock",
    stockNum: 20
  },
  {
    id: "psu-1",
    name: "Fuente 850W 80 Plus Gold Voltek",
    category: "Componentes",
    brand: "VOLTEK",
    price: 159999,
    img: "assets/flash_psu.svg",
    images: ["assets/flash_psu.svg", "assets/flash_case.svg"],
    specs: { "Potencia": "850W", "Certificación": "80 Plus Gold", "Modular": "Full Modular" },
    socket: "ATX",
    stock: "A Pedido",
    stockNum: 10
  },
  {
    id: "case-1",
    name: "Gabinete ATX Mesh RGB Nexcore",
    category: "Componentes",
    brand: "NEXCORE",
    price: 134999,
    img: "assets/flash_case.svg",
    images: ["assets/flash_case.svg", "assets/flash_cooler.svg", "assets/slide_gabinete.png"],
    specs: { "Tipo": "Mid Tower ATX", "Vidrio Templado": "Lateral magnético", "Ventiladores": "4x 120mm ARGB" },
    socket: "ATX",
    stock: "En Stock",
    stockNum: 7
  }
];

// 2. GLOBAL STATE
let cart = JSON.parse(localStorage.getItem('overvolt_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('overvolt_wishlist')) || [];
let currentCoupon = JSON.parse(localStorage.getItem('overvolt_coupon')) || null;

// 3. UTILITIES & FORMATTING
function formatMoney(amount) {
  return '$' + Math.floor(amount).toLocaleString('es-AR');
}

// 4. MOBILE MENU TOGGLE
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !expanded);
    mainNav.classList.toggle('is-open');
  });
}

// 5. STICKY HEADER & SCROLL-TO-TOP
const header = document.querySelector('.site-header');
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    if (header) header.classList.add('is-sticky');
  } else {
    if (header) header.classList.remove('is-sticky');
  }

  if (window.scrollY > 400) {
    if (scrollTopBtn) scrollTopBtn.classList.add('is-visible');
  } else {
    if (scrollTopBtn) scrollTopBtn.classList.remove('is-visible');
  }
});
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 6. COUNTDOWNS
function updateCountdowns() {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diff = tomorrow - now;

  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const hStr = String(hours).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  const heroHrs = document.querySelector('#heroCountdown [data-unit="hours"]');
  const heroMins = document.querySelector('#heroCountdown [data-unit="minutes"]');
  const heroSecs = document.querySelector('#heroCountdown [data-unit="seconds"]');
  if (heroHrs) heroHrs.textContent = hStr;
  if (heroMins) heroMins.textContent = mStr;
  if (heroSecs) heroSecs.textContent = sStr;

  const flashTimer = document.getElementById('flashTimer');
  if (flashTimer) {
    flashTimer.textContent = `⏱ Renuevan en ${hStr}:${mStr}:${sStr}`;
  }
}
setInterval(updateCountdowns, 1000);
updateCountdowns();

// 7. CAROUSEL BANNER CONTROLS
const track = document.getElementById('sliderTrack');
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');
const dotsContainer = document.getElementById('sliderDots');
const originalSlides = document.querySelectorAll('.slide');

if (track && originalSlides.length > 0) {
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
  firstClone.classList.add('slide-clone');
  lastClone.classList.add('slide-clone');

  track.appendChild(firstClone);
  track.insertBefore(lastClone, originalSlides[0]);

  const allSlides = track.querySelectorAll('.slide');
  let currentIdx = 1;
  let slideInterval;
  let isTransitioning = false;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    originalSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('is-active');
      dot.setAttribute('aria-label', `Banner ${i + 1}`);
      dot.addEventListener('click', () => {
        if (!isTransitioning) goToSlide(i + 1);
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll('.slider-dot');

  track.style.transition = 'none';
  track.style.transform = `translateX(-100%)`;

  function updateDots() {
    if (dots.length === 0) return;
    let activeIdx = currentIdx - 1;
    if (currentIdx === 0) activeIdx = originalSlides.length - 1;
    if (currentIdx === allSlides.length - 1) activeIdx = 0;
    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === activeIdx);
    });
  }

  function goToSlide(targetIdx) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIdx = targetIdx;
    track.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
    track.style.transform = `translateX(-${currentIdx * 100}%)`;
    updateDots();
    resetInterval();

    allSlides.forEach(s => {
      const c = s.querySelector('.slide-in-rayo');
      if (c) c.classList.remove('fade-in-visible');
    });

    const activeContent = allSlides[currentIdx].querySelector('.slide-in-rayo');
    if (activeContent) {
      setTimeout(() => activeContent.classList.add('fade-in-visible'), 250);
    }
  }

  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (currentIdx === 0) {
      track.style.transition = 'none';
      currentIdx = originalSlides.length;
      track.style.transform = `translateX(-${currentIdx * 100}%)`;
    }
    if (currentIdx === allSlides.length - 1) {
      track.style.transition = 'none';
      currentIdx = 1;
      track.style.transform = `translateX(-${currentIdx * 100}%)`;
    }
    const activeContent = allSlides[currentIdx].querySelector('.slide-in-rayo');
    if (activeContent) activeContent.classList.add('fade-in-visible');
  });

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIdx - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIdx + 1));

  function startInterval() {
    slideInterval = setInterval(() => goToSlide(currentIdx + 1), 6000);
  }
  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }
  startInterval();

  setTimeout(() => {
    const initContent = originalSlides[0].querySelector('.slide-in-rayo');
    if (initContent) initContent.classList.add('fade-in-visible');
  }, 250);
}

// 8. UNIFIED TABS LOGIC
const tabButtons = document.querySelectorAll('.tab-nav-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('is-active'));
    tabPanels.forEach(p => p.classList.remove('is-active'));

    btn.classList.add('is-active');
    const panelId = btn.getAttribute('aria-controls');
    const targetPanel = document.getElementById(panelId);
    if (targetPanel) {
      targetPanel.classList.add('is-active');
    }
  });
});

// 9. AUTOCOMPLETE PREDICTIVE SEARCH
const searchInputEl = document.getElementById('searchInput');
const searchSuggestionsEl = document.getElementById('searchSuggestions');

if (searchInputEl && searchSuggestionsEl) {
  searchInputEl.addEventListener('input', () => {
    const query = searchInputEl.value.toLowerCase().trim();
    if (query.length < 2) {
      searchSuggestionsEl.classList.remove('is-active');
      searchSuggestionsEl.innerHTML = '';
      return;
    }

    const matches = PRODUCTS_DB.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query)
    ).slice(0, 4);

    if (matches.length === 0) {
      searchSuggestionsEl.classList.remove('is-active');
      searchSuggestionsEl.innerHTML = '';
      return;
    }

    searchSuggestionsEl.innerHTML = matches.map(p => `
      <a href="producto.html?id=${p.id}" class="suggestion-item">
        <img src="${p.img}" alt="${p.name}" class="suggestion-thumb" />
        <div class="suggestion-info">
          <span class="suggestion-title">${p.name}</span>
          <span class="suggestion-price font-mono">${formatMoney(p.price)}</span>
        </div>
      </a>
    `).join('');

    searchSuggestionsEl.classList.add('is-active');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
      searchSuggestionsEl.classList.remove('is-active');
    }
  });
}

// 10. WISHLIST TOGGLE AND STATE SYSTEM
const wishlistBadgeEl = document.querySelector('.wishlist-badge');

function updateWishlistBadge() {
  if (wishlistBadgeEl) {
    wishlistBadgeEl.textContent = wishlist.length;
    wishlistBadgeEl.style.transform = 'scale(1.3)';
    setTimeout(() => wishlistBadgeEl.style.transform = 'scale(1)', 200);
  }
}

function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  let favorited = false;
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(productId);
    favorited = true;
    showNotificationToast("LOCKED_ON", "GUARDADO EN FAVORITOS");
  }
  localStorage.setItem('overvolt_wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
  syncWishlistButtons();
  return favorited;
}

function syncWishlistButtons() {
  document.querySelectorAll('.wishlist-heart-btn, #pdpWishlistBtn').forEach(btn => {
    const id = btn.dataset.id || new URLSearchParams(window.location.search).get('id');
    if (id && wishlist.includes(id)) {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  });
}

document.addEventListener('click', e => {
  const heart = e.target.closest('.wishlist-heart-btn');
  if (heart) {
    e.preventDefault();
    const id = heart.dataset.id;
    toggleWishlist(id);
  }
});

updateWishlistBadge();
syncWishlistButtons();

// 11. LOGIN & ACCOUNT MODAL TRIGGERS
const accountBtn = document.getElementById('accountBtn');
const loginModal = document.getElementById('loginModal');
const loginClose = document.getElementById('loginClose');
const loginOverlay = document.getElementById('loginOverlay');
const loginForm = document.getElementById('loginForm');

function openLoginModal() {
  if (loginModal) loginModal.classList.add('is-active');
}
function closeLoginModal() {
  if (loginModal) loginModal.classList.remove('is-active');
}
if (accountBtn) accountBtn.addEventListener('click', openLoginModal);
if (loginClose) loginClose.addEventListener('click', closeLoginModal);
if (loginOverlay) loginOverlay.addEventListener('click', closeLoginModal);

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    closeLoginModal();
    showNotificationToast("SYS_OK", "ACCESO PERMITIDO. SESION INICIADA.");
  });
}

// 12. TOAST NOTIFICATIONS
function showNotificationToast(status, message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'cyber-toast';
  const idStr = `SEC_${Math.floor(1000 + Math.random() * 9000)}`;

  toast.innerHTML = `
    <div class="cyber-toast-header">
      <span>[${status}] ${idStr}</span>
      <span>READY</span>
    </div>
    <div class="cyber-toast-body">
      ${message.toUpperCase()}
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('is-active'), 20);

  setTimeout(() => {
    toast.classList.remove('is-active');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// 13. DYNAMIC CART DRAWER SYSTEM
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItemsContainer = document.getElementById('cartItems');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const cartDiscountRow = document.getElementById('cartDiscountRow');
const cartDiscountEl = document.getElementById('cartDiscount');
const cartTotalEl = document.getElementById('cartTotal');
const cartResetBtn = document.getElementById('cartResetBtn');
const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
const cartBadge = document.querySelector('.cart-badge');
const cartBtn = document.querySelector('.cart-button');

const couponInput = document.getElementById('couponInput');
const applyCouponBtn = document.getElementById('applyCouponBtn');
const couponStatusMessage = document.getElementById('couponStatusMessage');

function openCart() {
  if (cartDrawer) cartDrawer.setAttribute('aria-hidden', 'false');
}
function closeCart() {
  if (cartDrawer) cartDrawer.setAttribute('aria-hidden', 'true');
}
if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
if (cartClose) cartClose.addEventListener('click', closeCart);

function updateCartBadge() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartBadge) {
    cartBadge.textContent = totalQty;
    cartBadge.style.transform = 'scale(1.25)';
    setTimeout(() => cartBadge.style.transform = 'scale(1)', 200);
  }
}

function renderCart() {
  localStorage.setItem('overvolt_cart', JSON.stringify(cart));
  updateCartBadge();

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty-message" style="text-align: center; padding: 40px 20px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--dim)" stroke-width="1.8" style="width: 48px; height: 48px; margin-bottom: 15px;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p style="font-family: var(--font-body); color: var(--dim);">Tu carrito de compras está vacío</p>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatMoney(0);
    if (cartDiscountRow) cartDiscountRow.style.display = 'none';
    if (cartTotalEl) cartTotalEl.textContent = formatMoney(0);
    return;
  }

  cartItemsContainer.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    const itemSubtotal = item.price * item.qty;
    subtotal += itemSubtotal;

    const itemEl = document.createElement('div');
    itemEl.classList.add('cart-item-line');
    itemEl.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="cart-item-thumb" />
      <div class="cart-item-details">
        <span class="cart-item-title">${item.name}</span>
        <span class="cart-item-price font-mono">${formatMoney(item.price)} c/u</span>
      </div>
      <div class="cart-item-actions">
        <div class="pdp-qty-selector" style="margin-bottom: 0;">
          <button class="qty-btn cart-dec-qty" data-id="${item.id}" style="height: 30px; width: 24px;">-</button>
          <span class="qty-num cart-qty-val" style="width: 20px;">${item.qty}</span>
          <button class="qty-btn cart-inc-qty" data-id="${item.id}" style="height: 30px; width: 24px;">+</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  let discount = 0;
  if (currentCoupon) {
    discount = subtotal * currentCoupon.value;
  }

  const total = subtotal - discount;

  if (cartSubtotalEl) cartSubtotalEl.textContent = formatMoney(subtotal);

  if (discount > 0) {
    if (cartDiscountRow) cartDiscountRow.style.display = 'flex';
    if (cartDiscountEl) cartDiscountEl.textContent = `-${formatMoney(discount)} (${currentCoupon.code})`;
  } else {
    if (cartDiscountRow) cartDiscountRow.style.display = 'none';
  }

  if (cartTotalEl) cartTotalEl.textContent = formatMoney(total);

  document.querySelectorAll('.cart-dec-qty').forEach(btn => {
    btn.addEventListener('click', () => changeCartQty(btn.dataset.id, -1));
  });
  document.querySelectorAll('.cart-inc-qty').forEach(btn => {
    btn.addEventListener('click', () => changeCartQty(btn.dataset.id, 1));
  });
}

function changeCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    renderCart();
  }
}

function addToCart(id, name, price, img, category, qty = 1) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, price: Number(price), img, qty: qty, category });
  }
  renderCart();
  showNotificationToast("SYS_OK", `${name} AGREGADO AL CARRITO`);
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-add-cart');
  if (btn) {
    const d = btn.dataset;
    addToCart(d.id, d.name, d.price, d.img, d.category);
  }
});

if (cartResetBtn) {
  cartResetBtn.addEventListener('click', () => {
    cart = [];
    currentCoupon = null;
    localStorage.removeItem('overvolt_coupon');
    if (couponInput) couponInput.value = '';
    if (couponStatusMessage) couponStatusMessage.textContent = '';
    renderCart();
  });
}

if (applyCouponBtn && couponInput) {
  applyCouponBtn.addEventListener('click', () => {
    const code = couponInput.value.toUpperCase().trim();
    if (code === 'OVERVOLT10') {
      currentCoupon = { code: 'OVERVOLT10', value: 0.10 };
      localStorage.setItem('overvolt_coupon', JSON.stringify(currentCoupon));
      couponStatusMessage.textContent = 'CUPÓN OVERVOLT10 APLICADO (10% OFF)';
      couponStatusMessage.className = 'coupon-status success';
      renderCart();
    } else if (code === 'GAMER5') {
      currentCoupon = { code: 'GAMER5', value: 0.05 };
      localStorage.setItem('overvolt_coupon', JSON.stringify(currentCoupon));
      couponStatusMessage.textContent = 'CUPÓN GAMER5 APLICADO (5% OFF)';
      couponStatusMessage.className = 'coupon-status success';
      renderCart();
    } else {
      couponStatusMessage.textContent = 'CUPÓN INVÁLIDO';
      couponStatusMessage.className = 'coupon-status error';
    }
  });
}

if (cartCheckoutBtn) {
  cartCheckoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    const totalAmount = cartTotalEl ? cartTotalEl.textContent : '';
    alert(`[OVERVOLT SYSTEM TERMINAL]\n-----------------------------\nESTADO: ORDEN DE COMPRA ACEPTADA\nTRANSACCION: OV-2026-${Math.floor(1000 + Math.random()*9000)}\nIMPORTE FINAL: ${totalAmount}\n\n¡Gracias por elegir OVERVOLT!`);
    cart = [];
    currentCoupon = null;
    localStorage.removeItem('overvolt_coupon');
    if (couponInput) couponInput.value = '';
    if (couponStatusMessage) couponStatusMessage.textContent = '';
    renderCart();
    closeCart();
  });
}

if (currentCoupon && couponInput) {
  couponInput.value = currentCoupon.code;
  if (couponStatusMessage) {
    couponStatusMessage.textContent = `CUPÓN ${currentCoupon.code} ACTIVO (${currentCoupon.value * 100}% OFF)`;
    couponStatusMessage.className = 'coupon-status success';
  }
}
renderCart();

// 14. PLP DYNAMIC RENDER & FILTER (categoria.html)
const plpContainer = document.getElementById('categoryProductsGrid');
const activeCategoryName = document.getElementById('activeCategoryName');
const productCountEl = document.getElementById('productCount');
const sortSelect = document.getElementById('sortSelect');
const btnResetFilters = document.getElementById('btnResetFilters');

const openFiltersBtn = document.getElementById('openFiltersBtn');
const filterSidebar = document.getElementById('filterSidebar');
const closeFiltersBtn = document.getElementById('closeFiltersBtn');

if (openFiltersBtn && filterSidebar) {
  openFiltersBtn.addEventListener('click', () => filterSidebar.classList.add('is-active'));
}
if (closeFiltersBtn) {
  closeFiltersBtn.addEventListener('click', () => filterSidebar.classList.remove('is-active'));
}

if (plpContainer) {
  const params = new URLSearchParams(window.location.search);
  const queryCat = params.get('cat');
  if (queryCat && activeCategoryName) {
    activeCategoryName.textContent = queryCat;
  }

  let plpCurrentPage = 1;
  const plpProductsPerPage = 6;

  function renderCategoryGrid() {
    let filtered = [...PRODUCTS_DB];

    // Filter by Category
    if (queryCat) {
      const q = queryCat.toLowerCase().trim();
      if (q === 'componentes') {
        filtered = filtered.filter(p => 
          p.category.toLowerCase() === 'componentes' || 
          p.category.toLowerCase() === 'placas de video' || 
          p.category.toLowerCase() === 'procesadores'
        );
      } else {
        filtered = filtered.filter(p => p.category.toLowerCase().includes(q));
      }
    }

    // Filter by Brand
    const activeBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(cb => cb.value);
    if (activeBrands.length > 0) {
      filtered = filtered.filter(p => activeBrands.includes(p.brand));
    }

    // Filter by Socket/Compatibility
    const activeSockets = Array.from(document.querySelectorAll('.socket-filter:checked')).map(cb => cb.value);
    if (activeSockets.length > 0) {
      filtered = filtered.filter(p => activeSockets.includes(p.socket));
    }

    // Filter by Availability
    const activeStock = Array.from(document.querySelectorAll('.stock-filter:checked')).map(cb => cb.value);
    if (activeStock.length > 0) {
      filtered = filtered.filter(p => activeStock.includes(p.stock));
    }

    // Filter by Price range
    const maxPrice = Number(document.getElementById('priceRange').value);
    filtered = filtered.filter(p => p.price <= maxPrice);
    const priceMaxLabel = document.getElementById('priceMaxLabel');
    if (priceMaxLabel) {
      priceMaxLabel.textContent = `Max: ${formatMoney(maxPrice)}`;
    }

    // Sorting
    const sortBy = sortSelect ? sortSelect.value : 'relevance';
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'best-seller') {
      filtered.sort((a, b) => (b.oldPrice ? b.oldPrice - b.price : 0) - (a.oldPrice ? a.oldPrice - a.price : 0));
    }

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / plpProductsPerPage) || 1;
    if (plpCurrentPage > totalPages) {
      plpCurrentPage = totalPages;
    }

    if (totalItems === 0) {
      plpContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <p style="font-family: var(--font-body); color: var(--dim); font-size: var(--fs-md);">No se encontraron productos con los filtros seleccionados.</p>
        </div>
      `;
      if (productCountEl) productCountEl.innerHTML = 'Mostrando <span class="accent">0</span> de 12 productos';
      
      const paginationEl = document.querySelector('.pagination');
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    const startIndex = (plpCurrentPage - 1) * plpProductsPerPage;
    const endIndex = startIndex + plpProductsPerPage;
    const paginatedItems = filtered.slice(startIndex, endIndex);

    plpContainer.innerHTML = paginatedItems.map(p => {
      const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
      return `
        <article class="product-card" data-category="${p.category}">
          ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
          <div class="product-thumb">
            <button class="wishlist-heart-btn ${wishlist.includes(p.id) ? 'is-active' : ''}" data-id="${p.id}" aria-label="Agregar a favoritos">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </button>
            <div class="product-tags">
              ${p.price > 150000 ? '<span class="tag-badge tag-cyan">Envío Gratis</span>' : ''}
              ${p.stockNum && p.stockNum < 4 ? '<span class="tag-badge tag-lime">Stock Bajo</span>' : ''}
            </div>
            <img src="${p.img}" alt="${p.name}" />
          </div>
          <div class="product-info">
            <span class="product-category">${p.category}</span>
            <h3 class="product-name"><a href="producto.html?id=${p.id}">${p.name}</a></h3>
            <div class="product-price-container">
              ${p.oldPrice ? `<span class="old-price">${formatMoney(p.oldPrice)}</span>` : ''}
              <div class="price-row special">
                <span class="price-label">Especial:</span>
                <span class="price-value">${formatMoney(p.price)}</span>
              </div>
              <div class="price-row list">
                <span class="price-label">Lista / Tarjeta:</span>
                <span class="price-value">${formatMoney(p.price * 1.2)}</span>
              </div>
              <span class="price-installments">o 12 cuotas de ${formatMoney((p.price * 1.2) / 12)}</span>
            </div>
            <button class="btn-add-cart" 
                    data-id="${p.id}" 
                    data-name="${p.name}" 
                    data-price="${p.price}" 
                    data-img="${p.img}" 
                    data-category="${p.category}">
              AGREGAR
            </button>
          </div>
        </article>
      `;
    }).join('');

    if (productCountEl) {
      productCountEl.innerHTML = `Mostrando <span class="accent">${paginatedItems.length}</span> de ${totalItems} productos`;
    }

    // Dynamic Pagination UI
    const paginationEl = document.querySelector('.pagination');
    if (paginationEl) {
      let paginationHtml = '';
      
      // Prev arrow
      paginationHtml += `<button class="pagination-btn arrow ${plpCurrentPage === 1 ? 'is-disabled' : ''}" id="plpPrevPage" aria-label="Página anterior">◀</button>`;
      
      // Numbers
      for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button class="pagination-btn ${plpCurrentPage === i ? 'is-active' : ''}" data-page="${i}">${i}</button>`;
      }
      
      // Next arrow
      paginationHtml += `<button class="pagination-btn arrow ${plpCurrentPage === totalPages ? 'is-disabled' : ''}" id="plpNextPage" aria-label="Página siguiente">▶</button>`;
      
      paginationEl.innerHTML = paginationHtml;

      // Listeners for page numbers
      paginationEl.querySelectorAll('.pagination-btn:not(.arrow)').forEach(btn => {
        btn.addEventListener('click', () => {
          plpCurrentPage = Number(btn.dataset.page);
          renderCategoryGrid();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });

      // Listeners for arrows
      const prevBtnEl = document.getElementById('plpPrevPage');
      if (prevBtnEl && plpCurrentPage > 1) {
        prevBtnEl.addEventListener('click', () => {
          plpCurrentPage--;
          renderCategoryGrid();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      const nextBtnEl = document.getElementById('plpNextPage');
      if (nextBtnEl && plpCurrentPage < totalPages) {
        nextBtnEl.addEventListener('click', () => {
          plpCurrentPage++;
          renderCategoryGrid();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    }
  }

  function onFilterChange() {
    plpCurrentPage = 1;
    renderCategoryGrid();
  }

  document.querySelectorAll('.brand-filter, .socket-filter, .stock-filter').forEach(cb => {
    cb.addEventListener('change', onFilterChange);
  });
  
  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    priceRange.addEventListener('input', onFilterChange);
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', onFilterChange);
  }

  if (btnResetFilters) {
    btnResetFilters.addEventListener('click', () => {
      document.querySelectorAll('.brand-filter, .socket-filter, .stock-filter').forEach(cb => cb.checked = false);
      if (priceRange) priceRange.value = 1000000;
      if (sortSelect) sortSelect.value = 'relevance';
      plpCurrentPage = 1;
      renderCategoryGrid();
    });
  }

  renderCategoryGrid();
}

// 15. PDP DYNAMIC DETAILS PAGE (producto.html)
const pdpMainImage = document.getElementById('pdpMainImage');
const pdpThumbnails = document.getElementById('pdpThumbnails');
const pdpTitle = document.getElementById('pdpTitle');
const pdpCategory = document.getElementById('pdpCategory');
const pdpSku = document.getElementById('pdpSku');
const pdpPriceSpecial = document.getElementById('pdpPriceSpecial');
const pdpPriceList = document.getElementById('pdpPriceList');
const pdpPriceInstallments = document.getElementById('pdpPriceInstallments');

const pdpBreadcrumbCategory = document.getElementById('pdpBreadcrumbCategory');
const pdpBreadcrumbName = document.getElementById('pdpBreadcrumbName');

const pdpDecQtyBtn = document.getElementById('pdpDecQtyBtn');
const pdpIncQtyBtn = document.getElementById('pdpIncQtyBtn');
const pdpQtyVal = document.getElementById('pdpQtyVal');
const pdpAddToCartBtn = document.getElementById('pdpAddToCartBtn');
const pdpWishlistBtn = document.getElementById('pdpWishlistBtn');

const pdpSpecsTableBody = document.getElementById('pdpSpecsTableBody');
const pdpReviewsContainer = document.getElementById('pdpReviewsContainer');
const pdpRelatedProductsGrid = document.getElementById('pdpRelatedProductsGrid');

if (pdpTitle) {
  const pdpParams = new URLSearchParams(window.location.search);
  const pdpProductId = pdpParams.get('id') || 'flash-gpu';

  const product = PRODUCTS_DB.find(p => p.id === pdpProductId) || PRODUCTS_DB[0];

  document.title = `${product.name} — OVERVOLT`;
  pdpTitle.textContent = product.name;
  pdpCategory.textContent = product.category.toUpperCase();
  pdpSku.textContent = `SKU: OV-${product.id.toUpperCase()}-${Math.floor(100000 + Math.random()*900000)}`;

  if (pdpBreadcrumbCategory) {
    pdpBreadcrumbCategory.textContent = product.category;
    pdpBreadcrumbCategory.href = `categoria.html?cat=${product.category}`;
  }
  if (pdpBreadcrumbName) {
    pdpBreadcrumbName.textContent = product.name;
  }

  pdpPriceSpecial.textContent = formatMoney(product.price);
  pdpPriceList.textContent = formatMoney(product.price * 1.2);
  pdpPriceInstallments.textContent = `o 12 cuotas sin interés de ${formatMoney((product.price * 1.2) / 12)}`;

  const pdpTagShipping = document.getElementById('pdpTagShipping');
  const pdpTagPromo = document.getElementById('pdpTagPromo');
  if (pdpTagShipping) {
    pdpTagShipping.style.display = product.price > 150000 ? 'inline-block' : 'none';
  }
  if (pdpTagPromo) {
    pdpTagPromo.style.display = product.oldPrice ? 'inline-block' : 'none';
  }

  if (pdpMainImage) {
    pdpMainImage.src = product.img;
    pdpMainImage.alt = product.name;
  }

  if (pdpThumbnails && product.images && product.images.length > 0) {
    pdpThumbnails.innerHTML = product.images.map((imgSrc, index) => `
      <button class="pdp-thumb-btn ${index === 0 ? 'is-active' : ''}" data-src="${imgSrc}">
        <img src="${imgSrc}" alt="${product.name} vista ${index + 1}" />
      </button>
    `).join('');

    document.querySelectorAll('.pdp-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pdp-thumb-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        if (pdpMainImage) {
          pdpMainImage.src = btn.dataset.src;
          pdpMainImage.style.transform = 'scale(0.95) rotate(0deg)';
          setTimeout(() => {
            pdpMainImage.style.transform = 'scale(1.08) rotate(-5deg)';
          }, 150);
        }
      });
    });
  }

  let pdpQuantity = 1;
  if (pdpDecQtyBtn && pdpIncQtyBtn && pdpQtyVal) {
    pdpDecQtyBtn.addEventListener('click', () => {
      if (pdpQuantity > 1) {
        pdpQuantity--;
        pdpQtyVal.textContent = pdpQuantity;
      }
    });
    pdpIncQtyBtn.addEventListener('click', () => {
      pdpQuantity++;
      pdpQtyVal.textContent = pdpQuantity;
    });
  }

  if (pdpAddToCartBtn) {
    pdpAddToCartBtn.addEventListener('click', () => {
      addToCart(product.id, product.name, product.price, product.img, product.category, pdpQuantity);
    });
  }

  if (pdpWishlistBtn) {
    pdpWishlistBtn.dataset.id = product.id;
    if (wishlist.includes(product.id)) {
      pdpWishlistBtn.classList.add('is-active');
    }
    pdpWishlistBtn.addEventListener('click', () => {
      toggleWishlist(product.id);
    });
  }

  if (pdpSpecsTableBody && product.specs) {
    pdpSpecsTableBody.innerHTML = Object.entries(product.specs).map(([key, val]) => `
      <tr>
        <td>${key}</td>
        <td>${val}</td>
      </tr>
    `).join('');
  }

  if (pdpRelatedProductsGrid) {
    const related = PRODUCTS_DB.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    if (related.length === 0) {
      const fallback = PRODUCTS_DB.filter(p => p.id !== product.id).slice(0, 4);
      renderRelatedGrid(fallback);
    } else {
      renderRelatedGrid(related);
    }
  }

  function renderRelatedGrid(list) {
    pdpRelatedProductsGrid.innerHTML = list.map(p => `
      <article class="product-card">
        <div class="product-thumb">
          <button class="wishlist-heart-btn ${wishlist.includes(p.id) ? 'is-active' : ''}" data-id="${p.id}" aria-label="Agregar a favoritos">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
          <img src="${p.img}" alt="${p.name}" />
        </div>
        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <h3 class="product-name"><a href="producto.html?id=${p.id}">${p.name}</a></h3>
          <div class="product-price-container">
            <div class="price-row special">
              <span class="price-label">Especial:</span>
              <span class="price-value">${formatMoney(p.price)}</span>
            </div>
          </div>
          <button class="btn-add-cart" 
                  data-id="${p.id}" 
                  data-name="${p.name}" 
                  data-price="${p.price}" 
                  data-img="${p.img}" 
                  data-category="${p.category}">
            AGREGAR
          </button>
        </div>
      </article>
    `).join('');
  }

  if (pdpReviewsContainer) {
    const defaultReviews = [
      { author: "@HardcorePlayer", text: "Excelente calidad de materiales, cumple todo lo que promete. Recomiendo totalmente para gaming exigente.", date: "Hace 2 días", stars: "⭐⭐⭐⭐⭐" },
      { author: "@BuildLover_90", text: "Llegó super rápido por correo a Santa Fe. Embalaje perfecto. El producto es una bomba, no calienta nada.", date: "Hace 1 semana", stars: "⭐⭐⭐⭐⭐" },
      { author: "@NerdArg", text: "La relación precio/rendimiento es espectacular, sobre todo aprovechando el precio especial por transferencia.", date: "Hace 3 días", stars: "⭐⭐⭐⭐" }
    ];
    pdpReviewsContainer.innerHTML = defaultReviews.map(r => `
      <article class="review-card">
        <div class="review-meta">
          <span class="review-author font-mono">${r.author}</span>
          <span class="review-stars-small">${r.stars}</span>
        </div>
        <p class="review-text">"${r.text}"</p>
        <span class="review-date font-mono">${r.date}</span>
      </article>
    `).join('');
  }
}

// 16. DELIVERY VS BRANCH PICKUP TOGGLING AND ZIP CODE LOGISTICS CALCULATOR
const shippingRadios = document.querySelectorAll('input[name="shippingMethod"]');
const deliveryPanel = document.getElementById('deliveryPanel');
const pickupPanel = document.getElementById('pickupPanel');
const btnCalcShipping = document.getElementById('btnCalcShipping');
const zipCodeInput = document.getElementById('zipCodeInput');
const shippingResult = document.getElementById('shippingResult');

if (shippingRadios.length > 0) {
  shippingRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'delivery') {
        if (deliveryPanel) deliveryPanel.style.display = 'block';
        if (pickupPanel) pickupPanel.style.display = 'none';
      } else {
        if (deliveryPanel) deliveryPanel.style.display = 'none';
        if (pickupPanel) pickupPanel.style.display = 'block';
      }
    });
  });
}

if (btnCalcShipping && zipCodeInput && shippingResult) {
  btnCalcShipping.addEventListener('click', () => {
    const val = zipCodeInput.value.trim();
    if (val.length < 4 || isNaN(val)) {
      shippingResult.textContent = '❌ CÓDIGO POSTAL INVÁLIDO. INGRESÁ 4 O 5 NÚMEROS.';
      shippingResult.style.color = 'var(--magenta)';
      return;
    }

    const zipNum = Number(val);
    let cost = 3900;
    let days = "2 a 4 días hábiles";

    if (zipNum >= 1000 && zipNum <= 1899) {
      cost = 2500;
      days = "Llega mañana (Entrega prioritaria)";
    }

    const pdpParams = new URLSearchParams(window.location.search);
    const pdpProductId = pdpParams.get('id') || 'flash-gpu';
    const product = PRODUCTS_DB.find(p => p.id === pdpProductId) || PRODUCTS_DB[0];

    if (product.price >= 150000) {
      shippingResult.textContent = `🚚 ENVÍO GRATIS A TU DOMICILIO — (${days})`;
      shippingResult.style.color = 'var(--lime)';
    } else {
      shippingResult.textContent = `🚚 COSTO DE ENVÍO: ${formatMoney(cost)} — (${days})`;
      shippingResult.style.color = 'var(--cyan)';
    }
  });
}

// 17. AUTO-SCROLL CONVEYOR TRACK FOR TAPE-MODE OFERTAS CAROUSEL
function initAutoScrollTape() {
  const tape = document.getElementById('productsGrid');
  if (!tape) return;

  const originalCards = Array.from(tape.children);
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    tape.appendChild(clone);
  });

  let isHovered = false;
  let scrollPos = tape.scrollLeft;
  let loopLimit = tape.scrollWidth / 2;

  window.addEventListener('resize', () => {
    loopLimit = tape.scrollWidth / 2;
  });

  tape.addEventListener('mouseenter', () => isHovered = true);
  tape.addEventListener('mouseleave', () => {
    isHovered = false;
    scrollPos = tape.scrollLeft;
  });

  tape.addEventListener('scroll', () => {
    if (isHovered) scrollPos = tape.scrollLeft;
  });

  function tick() {
    if (!isHovered) {
      scrollPos += 0.8;
      if (scrollPos >= loopLimit) scrollPos -= loopLimit;
      tape.scrollLeft = Math.floor(scrollPos);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  const btnPrev = document.getElementById('slidePrev');
  const btnNext = document.getElementById('slideNext');
  
  if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      isHovered = true;
      if (tape.scrollLeft <= 10) {
        tape.scrollLeft = loopLimit;
        scrollPos = loopLimit;
      }
      tape.scrollBy({ left: -296, behavior: 'smooth' });
      setTimeout(() => {
        scrollPos = tape.scrollLeft;
        isHovered = false;
      }, 600);
    });

    btnNext.addEventListener('click', () => {
      isHovered = true;
      if (tape.scrollLeft >= loopLimit - 10) {
        tape.scrollLeft -= loopLimit;
        scrollPos -= loopLimit;
      }
      tape.scrollBy({ left: 296, behavior: 'smooth' });
      setTimeout(() => {
        scrollPos = tape.scrollLeft;
        isHovered = false;
      }, 600);
    });
  }
}

// Initial script execution triggers
initAutoScrollTape();
syncWishlistButtons();

// 18. SCROLL ENTRANCE ANIMATIONS (IntersectionObserver)
const fadeElements = document.querySelectorAll('.fade-in-element');
if (fadeElements.length > 0) {
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
      }
    });
  }, { threshold: 0.1 });
  fadeElements.forEach(el => scrollObserver.observe(el));
}

// 19. PC COMPONENT COMPARATOR PLUGIN INITIALIZATION
if (window.ComponentComparator) {
  ComponentComparator.init({
    catalog: 'component-comparator/catalog.example.json',
    mountSelector: '#comparator-root'
  });
}



# PC Component Compatibility & Comparison Plugin (100% Client-Side)

Este es un plugin independiente, modular y 100% portátil para la comparación de componentes de hardware y la validación en tiempo real de su compatibilidad técnica. 

> [!IMPORTANT]
> **Este plugin NO requiere backend ni conexión a internet** más allá de cargar la página. Todo el cálculo de compatibilidad ocurre de forma instantánea en el navegador del usuario final.

---

## 1. Arquitectura de Archivos

Para integrar este plugin en cualquier otro proyecto, solo debés copiar los siguientes archivos:

```
/component-comparator/
  ├── compatibility-engine.js      → Motor de reglas de compatibilidad (lógica pura, sin DOM)
  ├── component-comparator-ui.js   → Lógica visual, eventos, renderizado y persistencia en LocalStorage
  ├── component-comparator.css     → Estilos cyberpunk adaptables vía variables CSS (--cc-*)
  └── catalog.example.json         → Catálogo con datos reales del proyecto
```

---

## 2. Guía de Integración

### Paso 1: Importar hojas de estilos y scripts en el HTML
Cargá el archivo CSS en la cabecera y los scripts en el orden correcto al final de la etiqueta `<head>` o antes del cierre de `<body>`:

```html
<!-- Estilos del plugin -->
<link rel="stylesheet" href="component-comparator/component-comparator.css" />

<!-- Scripts del comparador (defer recomendados) -->
<script src="component-comparator/compatibility-engine.js" defer></script>
<script src="component-comparator/component-comparator-ui.js" defer></script>
```

### Paso 2: Inicializar el plugin en tu código JS
Podés pasarle a la API una **ruta relativa a tu archivo JSON local** (fetch estático) o un **array de objetos directo** que ya tengas en memoria:

#### Opción A: Carga mediante fetch local (JSON)
```javascript
ComponentComparator.init({
  catalog: 'component-comparator/catalog.example.json',
  mountSelector: '#comparator-root' // Opcional, por defecto crea e inyecta un #comparator-root en body
});
```

#### Opción B: Carga directa mediante Array en memoria
```javascript
const misProductos = [
  { id: "cpu-1", name: "Ryzen 5 7600", category: "cpu", socket: "AM5", tdp: 65 },
  // ...
];

ComponentComparator.init({
  catalog: misProductos
});
```

---

## 3. Especificaciones del Catálogo (catalog.json Schema)

Cada producto del catálogo debe tener un conjunto de propiedades requeridas según su categoría. Si falta un campo requerido para evaluar una regla, el motor marcará esa regla como `"NO EVALUABLE"` en lugar de fallar o romper la aplicación.

### Formato General por Categoría:

#### CPU (`"category": "cpu"`)
```json
{
  "id": "cpu-ryzen-7800x3d",
  "name": "AMD Ryzen 7 7800X3D",
  "brand": "AMD",
  "category": "cpu",
  "price": 469999,
  "img": "assets/flash_cpu.png",
  "socket": "AM5",
  "tdp": 120,
  "generation": "Zen 4"
}
```

#### Motherboard (`"category": "motherboard"`)
```json
{
  "id": "motherboard-asus-b650a",
  "name": "ASUS ROG Strix B650-A Gaming",
  "brand": "ASUS",
  "category": "motherboard",
  "price": 289999,
  "img": "assets/flash_mobo.png",
  "socket": "AM5",
  "ramType": "DDR5",
  "maxRamSpeed": 6400,
  "pcieSlots": 2,
  "m2Slots": 3,
  "formFactor": "ATX",
  "chipset": "B650"
}
```

#### RAM (`"category": "ram"`)
```json
{
  "id": "ram-corsair-ddr5-32g",
  "name": "Corsair Vengeance DDR5 32GB",
  "brand": "Corsair",
  "category": "ram",
  "price": 149999,
  "img": "assets/flash_ram.svg",
  "ramType": "DDR5",
  "speed": 5600
}
```

#### GPU / Placa de Video (`"category": "gpu"`)
```json
{
  "id": "gpu-rtx-4070-ti",
  "name": "NVIDIA GeForce RTX 4070 Ti",
  "brand": "NVIDIA",
  "category": "gpu",
  "price": 899999,
  "img": "assets/flash_gpu.png",
  "lengthMm": 305,
  "tdp": 285
}
```

#### Fuente de Poder / PSU (`"category": "psu"`)
```json
{
  "id": "psu-corsair-rm850x",
  "name": "Corsair RM850x 850W",
  "brand": "Corsair",
  "category": "psu",
  "price": 189999,
  "img": "assets/flash_psu.svg",
  "wattage": 850,
  "certification": "80 Plus Gold"
}
```

#### Gabinete / Case (`"category": "case"`)
```json
{
  "id": "case-nzxt-h7-flow",
  "name": "NZXT H7 Flow Black",
  "brand": "NZXT",
  "category": "case",
  "price": 159999,
  "img": "assets/flash_case.svg",
  "maxGpuLengthMm": 400,
  "maxCoolerHeightMm": 185,
  "formFactors": ["ATX", "Micro-ATX", "Mini-ITX"]
}
```

#### Disipador / Cooler (`"category": "cooler"`)
```json
{
  "id": "cooler-noctua-u12s",
  "name": "Noctua NH-U12S Chromax.Black",
  "brand": "Noctua",
  "category": "cooler",
  "price": 99999,
  "img": "assets/flash_cooler.svg",
  "heightMm": 158,
  "supportedSockets": ["AM4", "AM5", "LGA1700", "LGA1200"]
}
```

#### Almacenamiento SSD M.2 NVMe (`"category": "storage"`)
```json
{
  "id": "storage-samsung-990-pro-2t",
  "name": "Samsung 990 Pro 2TB NVMe M.2",
  "brand": "Samsung",
  "category": "storage",
  "price": 179999,
  "img": "assets/flash_ssd.svg",
  "interface": "NVMe",
  "type": "M.2 PCIe 4.0"
}
```

---

## 4. Personalización del Tema (CSS Custom Properties)

Podés reescribir los colores y fuentes del comparador editando tu archivo CSS o bien pasándolos en el objeto `theme` durante la inicialización (`init`).

### Lista completa de variables configurables:

* `--cc-bg-dark`: Color de fondo oscuro principal del modal.
* `--cc-bg-panel`: Color de fondo para paneles internos de reglas e informes.
* `--cc-border`: Color de los bordes del modal y tablas.
* `--cc-line`: Color de las grillas y acentos de diseño.
* `--cc-primary`: Color primario de acento cyberpunk (ej. cian para COMPATIBLE).
* `--cc-secondary`: Color secundario de contraste (ej. magenta para INCOMPATIBLE).
* `--cc-warning`: Color para notificaciones de advertencia (ej. amarillo/lima).
* `--cc-text`: Color de texto general.
* `--cc-text-muted`: Color de texto secundario/apagado.
* `--cc-font-display`: Tipografía para títulos (por defecto "Rajdhani").
* `--cc-font-sans`: Tipografía de lectura (por defecto "Barlow Semi Condensed").
* `--cc-font-mono`: Tipografía monoespaciada para datos técnicos (por defecto "JetBrains Mono").

#### Ejemplo de reescritura en JavaScript:
```javascript
ComponentComparator.init({
  catalog: 'component-comparator/catalog.example.json',
  theme: {
    primary: '#ff00ff', // Reemplazar cian por rosa de neón
    fontDisplay: '"Outfit", sans-serif'
  }
});
```

---

## 5. Ejecución de Pruebas Unitarias del Motor

El motor de reglas de compatibilidad técnica (`compatibility-engine.js`) cuenta con pruebas automatizadas que podés correr localmente en tu terminal para validar que no existan errores de código o regresiones:

```bash
# Ejecutar las pruebas unitarias
node component-comparator/test-engine.js
```
*Si no contás con una instalación local de Node en tu PATH, las pruebas se inyectan y autoevalúan en los flujos de pruebas de integración del navegador.*

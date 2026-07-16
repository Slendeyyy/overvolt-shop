# PC Component Compatibility & Comparison Plugin

Este es un plugin independiente, modular y reutilizable para la comparación de componentes de hardware y la validación en tiempo real de su compatibilidad técnica. 

El plugin consta de un frontend en **Vanilla JS/CSS** y un backend en **Python (Flask)**.

---

## 1. Arquitectura de Carpetas

```
/component-comparator/
  /frontend/
    component-comparator.js    → Lógica de UI (Vanilla JS, sin dependencias)
    component-comparator.css   → Estilos customizados con variables CSS (--cc-*)
  /backend/
    /data/
      components.json          → Base de datos con 96 especificaciones reales
    /src/
      server.py                → Servidor Flask (CORS, Rate Limit y Caché)
      rules.py                 → Motor de reglas de compatibilidad
    /tests/
      test_rules.py            → Suite de pruebas unitarias
    requirements.txt           → Dependencias
  README.md                    → Este archivo de documentación
```

---

## 2. API Endpoints (Backend REST API)

El backend expone tres rutas principales:

### `GET /api/components`
Retorna el catálogo completo o filtrado por categoría.
* **Query Params**: `category` (opcional: cpu, motherboard, ram, gpu, psu, case, cooler, storage)
* **Response (Ejemplo)**:
```json
[
  {
    "id": "cpu-ryzen-7800x3d",
    "name": "AMD Ryzen 7 7800X3D",
    "brand": "AMD",
    "category": "cpu",
    "price": 469999,
    "socket": "AM5",
    "tdp": 120,
    "generation": "Zen 4"
  }
]
```

### `GET /api/components/<id>`
Retorna la ficha técnica de un único componente.
* **Response (Ejemplo)**:
```json
{
  "id": "cpu-ryzen-7800x3d",
  "name": "AMD Ryzen 7 7800X3D",
  "brand": "AMD",
  "category": "cpu",
  "price": 469999,
  "socket": "AM5",
  "tdp": 120,
  "generation": "Zen 4"
}
```

### `POST /api/compatibility/check`
Recibe un listado de IDs seleccionados y retorna el estado de compatibilidad global e individual por regla.
* **Request Body**:
```json
{
  "ids": ["cpu-ryzen-7800x3d", "motherboard-asus-b650a", "ram-corsair-ddr5-32g"]
}
```
* **Response (Ejemplo)**:
```json
{
  "overallStatus": "COMPATIBLE",
  "rulesEvaluated": [
    {
      "ruleName": "CPU ↔ Motherboard (Socket)",
      "status": "COMPATIBLE",
      "message": "Socket del procesador y la placa madre coinciden (AM5).",
      "comparedValues": {
        "cpuSocket": "AM5",
        "moboSocket": "AM5"
      }
    },
    {
      "ruleName": "Motherboard ↔ RAM (Tipo & Velocidad)",
      "status": "COMPATIBLE",
      "message": "RAM compatible en tipo (DDR5) y velocidad (6000MHz).",
      "comparedValues": {
        "moboRamType": "DDR5",
        "ramType": "DDR5",
        "moboMaxSpeed": 6400,
        "ramSpeed": 6000
      }
    }
  ]
}
```

---

## 3. Despliegue del Backend

El backend está desarrollado en Python y puede ser desplegado en plataformas gratuitas o de bajo costo como **Render**, **Railway** o **Fly.io**.

### Requisitos de Despliegue (Render / Railway)
1. Conecta tu repositorio de GitHub a la plataforma de hosting.
2. Configura los siguientes parámetros en el panel de control:
   * **Runtime**: `Python`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `python src/server.py` o `gunicorn src.server:app` (para entornos de producción reales)
   * **Environment Variables**:
     * `PORT`: `3000` (o el puerto asignado automáticamente por el host)

---

## 4. Cómo Cargar o Actualizar el Catálogo de Componentes

Para agregar o modificar especificaciones de componentes:
1. Abre el archivo `/backend/data/components.json`.
2. Añade un nuevo objeto JSON asegurando los campos obligatorios correspondientes a su categoría (ej. un gabinete debe incluir `formFactors`, `maxGpuLengthMm` y `maxCoolerHeightMm`).
3. Si estás utilizando un despliegue en un contenedor persistente o serverless, puedes implementar un endpoint de administración (`POST /api/components`) o actualizar el archivo directamente vía git.

---

## 5. Integración en un Proyecto Nuevo Desde Cero

### Paso 1: Importar los recursos en el HTML
Copia los archivos a tu estructura de proyecto y añádelos en la etiqueta `<head>` de tu página web:
```html
<link rel="stylesheet" href="path/to/component-comparator.css" />
<script src="path/to/component-comparator.js" defer></script>
```

### Paso 2: Agregar el contenedor de anclaje (Opcional)
Define dónde se montarán el modal y la barra flotante. Si no lo especificas, se creará un div `#comparator-root` al final del body automáticamente.
```html
<div id="comparator-root"></div>
```

### Paso 3: Añadir Checkboxes en tus Tarjetas de Producto
Inserta checkboxes cyberpunk angular dentro de tus tarjetas de producto (estáticas o dinámicas) apuntando al ID del componente:
```html
<label class="cc-compare-checkbox">
  <input type="checkbox" class="cc-compare-checkbox-input" data-id="cpu-ryzen-7800x3d" />
  <span class="cc-compare-checkbox-box"></span>
  <span class="cc-compare-checkbox-text">COMPARAR</span>
</label>
```

### Paso 4: Inicializar el Plugin
Llama a la función de inicio de JS:
```javascript
document.addEventListener("DOMContentLoaded", () => {
  ComponentComparator.init({
    apiUrl: "https://mi-backend-comparator.onrender.com", // Tu URL de API
    mountSelector: "#comparator-root"
  });
});
```

---

## 6. Personalización del Tema (Variables CSS)

Puedes anular el diseño visual predeterminado del plugin para adaptarlo a cualquier paleta o tipografía sin necesidad de tocar el código de estilos nativo.

Pasa un objeto `theme` en la inicialización o añade overrides en tu archivo CSS principal:

```javascript
ComponentComparator.init({
  apiUrl: "http://localhost:3000",
  theme: {
    "bg-dark": "#0d0d0d",      // Cambiar fondo oscuro
    "bg-panel": "#1a1a1a",     // Cambiar fondo del modal
    "primary": "#ff3300",      // Cambiar color primario a naranja neón
    "secondary": "#00ff00",    // Cambiar color de alerta a verde
    "font-display": "'Roboto', sans-serif"
  }
});
```

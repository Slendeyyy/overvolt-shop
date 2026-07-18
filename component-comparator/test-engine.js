/**
 * PC Component Compatibility Engine - Unit Tests
 * Run with: node component-comparator/test-engine.js
 */
const CompatibilityEngine = require("./compatibility-engine");

let passedTestsCount = 0;
let failedTestsCount = 0;

function assert(condition, message) {
  if (condition) {
    passedTestsCount++;
  } else {
    failedTestsCount++;
    console.error(`\x1b[31m[FAIL] ${message}\x1b[0m`);
  }
}

console.log("\x1b[36m====================================================\x1b[0m");
console.log("\x1b[36m  EJECUTANDO PRUEBAS UNITARIAS DE COMPATIBILIDAD    \x1b[0m");
console.log("\x1b[36m====================================================\x1b[0m\n");

// --- Rule 1: CPU ↔ Motherboard (Socket) ---
console.log("-> Evaluando: CPU ↔ Motherboard");
const am5Cpu = { category: "cpu", socket: "AM5" };
const am5Mobo = { category: "motherboard", socket: "AM5" };
const lga1700Mobo = { category: "motherboard", socket: "LGA1700" };
const noSocketCpu = { category: "cpu" };

assert(
  CompatibilityEngine.checkCpuMotherboard(am5Cpu, am5Mobo).status === "COMPATIBLE",
  "Sockets coinciden (AM5 === AM5) debe ser COMPATIBLE"
);
assert(
  CompatibilityEngine.checkCpuMotherboard(am5Cpu, lga1700Mobo).status === "INCOMPATIBLE",
  "Sockets distintos (AM5 !== LGA1700) debe ser INCOMPATIBLE"
);
assert(
  CompatibilityEngine.checkCpuMotherboard(noSocketCpu, am5Mobo).status === "NO EVALUABLE",
  "Falta socket en CPU debe ser NO EVALUABLE"
);


// --- Rule 2: Motherboard ↔ RAM (Tipo & Velocidad) ---
console.log("-> Evaluando: Motherboard ↔ RAM");
const ddr5Mobo = { category: "motherboard", ramType: "DDR5", maxRamSpeed: 6000 };
const ddr5Ram = { category: "ram", ramType: "DDR5", speed: 5600 };
const ddr5FastRam = { category: "ram", ramType: "DDR5", speed: 6400 };
const ddr4Ram = { category: "ram", ramType: "DDR4", speed: 3200 };
const noRamTypeMobo = { category: "motherboard", maxRamSpeed: 6000 };

assert(
  CompatibilityEngine.checkMotherboardRam(ddr5Mobo, ddr5Ram).status === "COMPATIBLE",
  "Tipos coinciden y velocidad <= max debe ser COMPATIBLE"
);
assert(
  CompatibilityEngine.checkMotherboardRam(ddr5Mobo, ddr5FastRam).status === "ADVERTENCIA",
  "Velocidad de RAM excede la de placa madre debe ser ADVERTENCIA"
);
assert(
  CompatibilityEngine.checkMotherboardRam(ddr5Mobo, ddr4Ram).status === "INCOMPATIBLE",
  "Tipos distintos (DDR5 !== DDR4) debe ser INCOMPATIBLE"
);
assert(
  CompatibilityEngine.checkMotherboardRam(noRamTypeMobo, ddr5Ram).status === "NO EVALUABLE",
  "Falta ramType en mobo debe ser NO EVALUABLE"
);


// --- Rule 3: GPU ↔ Gabinete (Espacio) ---
console.log("-> Evaluando: GPU ↔ Gabinete");
const shortGpu = { category: "gpu", lengthMm: 240 };
const longGpu = { category: "gpu", lengthMm: 340 };
const compactCase = { category: "case", maxGpuLengthMm: 300 };
const noLengthGpu = { category: "gpu" };

assert(
  CompatibilityEngine.checkGpuCase(shortGpu, compactCase).status === "COMPATIBLE",
  "GPU de 240mm cabe en max 300mm debe ser COMPATIBLE"
);
assert(
  CompatibilityEngine.checkGpuCase(longGpu, compactCase).status === "INCOMPATIBLE",
  "GPU de 340mm excede max 300mm debe ser INCOMPATIBLE"
);
assert(
  CompatibilityEngine.checkGpuCase(noLengthGpu, compactCase).status === "NO EVALUABLE",
  "Falta longitud en GPU debe ser NO EVALUABLE"
);


// --- Rule 4: GPU ↔ Motherboard (PCIe Slot) ---
console.log("-> Evaluando: GPU ↔ Motherboard");
const singlePcieMobo = { category: "motherboard", pcieSlots: 1 };
const zeroPcieMobo = { category: "motherboard", pcieSlots: 0 };
const noPcieMobo = { category: "motherboard" };

assert(
  CompatibilityEngine.checkGpuMotherboard({}, singlePcieMobo).status === "COMPATIBLE",
  "Mobo con 1 PCIe slot debe ser COMPATIBLE"
);
assert(
  CompatibilityEngine.checkGpuMotherboard({}, zeroPcieMobo).status === "INCOMPATIBLE",
  "Mobo con 0 PCIe slots debe ser INCOMPATIBLE"
);
assert(
  CompatibilityEngine.checkGpuMotherboard({}, noPcieMobo).status === "NO EVALUABLE",
  "Falta pcieSlots en mobo debe ser NO EVALUABLE"
);


// --- Rule 5: Fuente de Poder (Consumo Energético) ---
console.log("-> Evaluando: Fuente de Poder");
const normalCpu = { category: "cpu", tdp: 100 };
const powerGpu = { category: "gpu", tdp: 250 }; // Estimación: (100 + 250 + 50) * 1.2 = 480W
const goodPsu = { category: "psu", wattage: 650 };
const weakPsu = { category: "psu", wattage: 450 };
const noTdpCpu = { category: "cpu" };

assert(
  CompatibilityEngine.checkPsuPower(normalCpu, powerGpu, goodPsu).status === "COMPATIBLE",
  "Fuente de 650W cubre consumo estimado de 480W debe ser COMPATIBLE"
);
assert(
  CompatibilityEngine.checkPsuPower(normalCpu, powerGpu, weakPsu).status === "INCOMPATIBLE",
  "Fuente de 450W no cubre consumo estimado de 480W debe ser INCOMPATIBLE"
);
assert(
  CompatibilityEngine.checkPsuPower(noTdpCpu, powerGpu, goodPsu).status === "NO EVALUABLE",
  "Falta TDP en CPU debe ser NO EVALUABLE"
);


// --- Rule 6: Motherboard ↔ Gabinete (Form Factor) ---
console.log("-> Evaluando: Motherboard ↔ Gabinete");
const atxMobo = { category: "motherboard", formFactor: "ATX" };
const matxMobo = { category: "motherboard", formFactor: "Micro-ATX" };
const atxCase = { category: "case", formFactors: ["ATX", "Micro-ATX", "Mini-ITX"] };
const compactItxCase = { category: "case", formFactors: ["Mini-ITX"] };
const noFfMobo = { category: "motherboard" };

assert(
  CompatibilityEngine.checkMotherboardCase(atxMobo, atxCase).status === "COMPATIBLE",
  "Gabinete ATX soporta mobo ATX debe ser COMPATIBLE"
);
assert(
  CompatibilityEngine.checkMotherboardCase(matxMobo, compactItxCase).status === "INCOMPATIBLE",
  "Gabinete ITX no soporta mobo Micro-ATX debe ser INCOMPATIBLE"
);
assert(
  CompatibilityEngine.checkMotherboardCase(noFfMobo, atxCase).status === "NO EVALUABLE",
  "Falta formFactor en mobo debe ser NO EVALUABLE"
);


// --- Rule 7: Disipador ↔ CPU (Socket) ---
console.log("-> Evaluando: Disipador ↔ CPU");
const am5Cooler = { category: "cooler", supportedSockets: ["AM4", "AM5", "LGA1700"] };
const itxCooler = { category: "cooler", supportedSockets: ["LGA1700"] };
const noSocketsCooler = { category: "cooler" };

assert(
  CompatibilityEngine.checkCoolerCpu(am5Cooler, am5Cpu).status === "COMPATIBLE",
  "Cooler con soporte AM5 en CPU AM5 debe ser COMPATIBLE"
);
assert(
  CompatibilityEngine.checkCoolerCpu(itxCooler, am5Cpu).status === "INCOMPATIBLE",
  "Cooler sin soporte AM5 en CPU AM5 debe ser INCOMPATIBLE"
);
assert(
  CompatibilityEngine.checkCoolerCpu(noSocketsCooler, am5Cpu).status === "NO EVALUABLE",
  "Falta sockets soportados en cooler debe ser NO EVALUABLE"
);


// --- Rule 8: Disipador ↔ Gabinete (Altura) ---
console.log("-> Evaluando: Disipador ↔ Gabinete");
const normalCooler = { category: "cooler", heightMm: 155 };
const giantCooler = { category: "cooler", heightMm: 165 };
const midCase = { category: "case", maxCoolerHeightMm: 160 };
const noHeightCooler = { category: "cooler" };

assert(
  CompatibilityEngine.checkCoolerCase(normalCooler, midCase).status === "COMPATIBLE",
  "Cooler de 155mm cabe en max 160mm debe ser COMPATIBLE"
);
assert(
  CompatibilityEngine.checkCoolerCase(giantCooler, midCase).status === "INCOMPATIBLE",
  "Cooler de 165mm excede max 160mm debe ser INCOMPATIBLE"
);
assert(
  CompatibilityEngine.checkCoolerCase(noHeightCooler, midCase).status === "NO EVALUABLE",
  "Falta altura en cooler debe ser NO EVALUABLE"
);


// --- Rule 9: Almacenamiento NVMe ↔ Motherboard (Slots M.2) ---
console.log("-> Evaluando: Almacenamiento NVMe ↔ Motherboard");
const singleM2Mobo = { category: "motherboard", m2Slots: 1 };
const twoM2Mobo = { category: "motherboard", m2Slots: 2 };
const singleNvme = [{ category: "storage", interface: "NVMe" }];
const doubleNvme = [{ category: "storage", interface: "NVMe" }, { category: "storage", interface: "NVMe" }];
const noSlotsMobo = { category: "motherboard" };

assert(
  CompatibilityEngine.checkStorageMotherboard(singleNvme, twoM2Mobo).status === "COMPATIBLE",
  "1 SSD NVMe en 2 slots M.2 debe ser COMPATIBLE"
);
assert(
  CompatibilityEngine.checkStorageMotherboard(doubleNvme, singleM2Mobo).status === "INCOMPATIBLE",
  "2 SSD NVMe en 1 slot M.2 debe ser INCOMPATIBLE"
);
assert(
  CompatibilityEngine.checkStorageMotherboard(doubleNvme, noSlotsMobo).status === "NO EVALUABLE",
  "Falta m2Slots en mobo debe ser NO EVALUABLE"
);


// --- Rule 10: Integración checkAllCompatibility ---
console.log("-> Evaluando: checkAllCompatibility (Integración)");

const compCpu = { category: "cpu", socket: "AM5", tdp: 65 };
const compMobo = { category: "motherboard", socket: "AM5", ramType: "DDR5", maxRamSpeed: 6000, pcieSlots: 2, formFactor: "ATX", m2Slots: 3 };
const compRam = { category: "ram", ramType: "DDR5", speed: 5600 };
const compGpu = { category: "gpu", lengthMm: 240, tdp: 150 };
const compPsu = { category: "psu", wattage: 650 };
const compCase = { category: "case", formFactors: ["ATX", "Micro-ATX"], maxGpuLengthMm: 350, maxCoolerHeightMm: 170 };
const compCooler = { category: "cooler", supportedSockets: ["AM5"], heightMm: 155 };
const compStorage = { category: "storage", interface: "NVMe" };

const validSet = [compCpu, compMobo, compRam, compGpu, compPsu, compCase, compCooler, compStorage];
const invalidSet = [compCpu, lga1700Mobo, compRam];

assert(
  CompatibilityEngine.checkAllCompatibility(validSet).overallStatus === "COMPATIBLE",
  "Set completamente compatible debe dar COMPATIBLE en checkAllCompatibility"
);
assert(
  CompatibilityEngine.checkAllCompatibility(invalidSet).overallStatus === "INCOMPATIBLE",
  "Set con sockets diferentes debe dar INCOMPATIBLE en checkAllCompatibility"
);


// --- REPORT RESULT ---
console.log("\n====================================================");
console.log("                  INFORME DE TEST                   ");
console.log("====================================================");
if (failedTestsCount === 0) {
  console.log(`\x1b[32m✔ ¡Todas las ${passedTestsCount} pruebas unitarias pasaron exitosamente!\x1b[0m`);
  process.exit(0);
} else {
  console.error(`\x1b[31m✖ Se encontraron fallos: ${failedTestsCount} fallados, ${passedTestsCount} aprobados.\x1b[0m`);
  process.exit(1);
}

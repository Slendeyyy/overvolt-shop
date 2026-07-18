/**
 * PC Component Compatibility Engine
 * Pure, side-effect free logic. Can be imported in browsers or Node.
 */
const CompatibilityEngine = (function () {
  function checkCpuMotherboard(cpu, mobo) {
    if (!cpu || !mobo) return null;
    const cpuSocket = cpu.socket;
    const moboSocket = mobo.socket;

    if (!cpuSocket) {
      return {
        status: "NO EVALUABLE",
        message: "Falta el dato de socket en el procesador.",
        comparedValues: { cpuSocket: null, moboSocket: moboSocket }
      };
    }
    if (!moboSocket) {
      return {
        status: "NO EVALUABLE",
        message: "Falta el dato de socket en la placa madre.",
        comparedValues: { cpuSocket: cpuSocket, moboSocket: null }
      };
    }

    const matches = cpuSocket.trim().toLowerCase() === moboSocket.trim().toLowerCase();
    return {
      status: matches ? "COMPATIBLE" : "INCOMPATIBLE",
      message: matches
        ? `Socket del procesador y la placa madre coinciden (${cpuSocket}).`
        : `El socket del procesador (${cpuSocket}) no es compatible con el de la placa madre (${moboSocket}).`,
      comparedValues: { cpuSocket: cpuSocket, moboSocket: moboSocket }
    };
  }

  function checkMotherboardRam(mobo, ram) {
    if (!mobo || !ram) return null;
    const moboRamType = mobo.ramType;
    const ramType = ram.ramType;
    const moboMaxSpeed = mobo.maxRamSpeed;
    const ramSpeed = ram.speed;

    if (!moboRamType) {
      return {
        status: "NO EVALUABLE",
        message: "Falta el tipo de RAM soportado en la placa madre.",
        comparedValues: { moboRamType: null, ramType: ramType }
      };
    }
    if (!ramType) {
      return {
        status: "NO EVALUABLE",
        message: "Falta el tipo de RAM en el módulo de memoria.",
        comparedValues: { moboRamType: moboRamType, ramType: null }
      };
    }

    const typeMatches = moboRamType.trim().toLowerCase() === ramType.trim().toLowerCase();
    if (!typeMatches) {
      return {
        status: "INCOMPATIBLE",
        message: `Tipo de memoria incompatible. La placa madre soporta ${moboRamType} pero la RAM es ${ramType}.`,
        comparedValues: { moboRamType: moboRamType, ramType: ramType }
      };
    }

    if (moboMaxSpeed !== undefined && moboMaxSpeed !== null && ramSpeed !== undefined && ramSpeed !== null) {
      if (ramSpeed > moboMaxSpeed) {
        return {
          status: "ADVERTENCIA",
          message: `La velocidad de la RAM (${ramSpeed}MHz) excede la velocidad máxima oficial de la placa madre (${moboMaxSpeed}MHz). Funcionará a velocidad degradada.`,
          comparedValues: { moboMaxSpeed: moboMaxSpeed, ramSpeed: ramSpeed }
        };
      }
    }

    return {
      status: "COMPATIBLE",
      message: `RAM compatible en tipo (${moboRamType}) y velocidad (${ramSpeed || 'N/A'}MHz).`,
      comparedValues: {
        moboRamType: moboRamType,
        ramType: ramType,
        moboMaxSpeed: moboMaxSpeed,
        ramSpeed: ramSpeed
      }
    };
  }

  function checkGpuCase(gpu, cabinet) {
    if (!gpu || !cabinet) return null;
    const gpuLength = gpu.lengthMm;
    const caseMaxGpu = cabinet.maxGpuLengthMm;

    if (gpuLength === undefined || gpuLength === null) {
      return {
        status: "NO EVALUABLE",
        message: "Falta la longitud de la placa de video.",
        comparedValues: { gpuLength: null, caseMaxGpu: caseMaxGpu }
      };
    }
    if (caseMaxGpu === undefined || caseMaxGpu === null) {
      return {
        status: "NO EVALUABLE",
        message: "Falta el despeje máximo de GPU en el gabinete.",
        comparedValues: { gpuLength: gpuLength, caseMaxGpu: null }
      };
    }

    const fits = gpuLength <= caseMaxGpu;
    return {
      status: fits ? "COMPATIBLE" : "INCOMPATIBLE",
      message: fits
        ? `La placa de video cabe en el gabinete (Largo: ${gpuLength}mm vs Gabinete: ${caseMaxGpu}mm max).`
        : `La placa de video es demasiado larga para el gabinete (${gpuLength}mm vs Max: ${caseMaxGpu}mm).`,
      comparedValues: { gpuLength: gpuLength, caseMaxGpu: caseMaxGpu }
    };
  }

  function checkGpuMotherboard(gpu, mobo) {
    if (!gpu || !mobo) return null;
    const pcieSlots = mobo.pcieSlots;

    if (pcieSlots === undefined || pcieSlots === null) {
      return {
        status: "NO EVALUABLE",
        message: "Falta cantidad de slots PCIe en la placa madre.",
        comparedValues: { pcieSlots: null }
      };
    }

    const hasSlot = pcieSlots >= 1;
    return {
      status: hasSlot ? "COMPATIBLE" : "INCOMPATIBLE",
      message: hasSlot
        ? `La placa madre tiene slots PCIe disponibles (${pcieSlots}).`
        : "La placa madre seleccionada no cuenta con slots PCIe x16 para la placa de video.",
      comparedValues: { moboPcieSlots: pcieSlots }
    };
  }

  function checkPsuPower(cpu, gpu, psu) {
    if (!psu) return null;
    const psuWatts = psu.wattage;

    if (!psuWatts) {
      return {
        status: "NO EVALUABLE",
        message: "Falta la potencia total de la fuente de alimentación.",
        comparedValues: { requiredWatts: null, psuWatts: null }
      };
    }

    const cpuTdp = cpu ? cpu.tdp : 0;
    const gpuTdp = gpu ? gpu.tdp : 0;

    if (cpu && (cpuTdp === undefined || cpuTdp === null)) {
      return {
        status: "NO EVALUABLE",
        message: "Falta el TDP del procesador para estimar el consumo.",
        comparedValues: { psuWatts: psuWatts }
      };
    }
    if (gpu && (gpuTdp === undefined || gpuTdp === null)) {
      return {
        status: "NO EVALUABLE",
        message: "Falta el TDP de la placa de video para estimar el consumo.",
        comparedValues: { psuWatts: psuWatts }
      };
    }

    const baseConsumption = (cpuTdp || 0) + (gpuTdp || 0) + 50;
    const requiredWatts = Math.ceil(baseConsumption * 1.20);
    const sufficient = psuWatts >= requiredWatts;

    return {
      status: sufficient ? "COMPATIBLE" : "INCOMPATIBLE",
      message: sufficient
        ? `Potencia de fuente suficiente. Consumo estimado (con +20% margen): ${requiredWatts}W vs Fuente: ${psuWatts}W.`
        : `Potencia de la fuente insuficiente. Consumo estimado necesario (con +20% margen): ${requiredWatts}W vs Fuente: ${psuWatts}W.`,
      comparedValues: { estimatedWatts: requiredWatts, psuWatts: psuWatts, cpuTdp: cpuTdp, gpuTdp: gpuTdp }
    };
  }

  function checkMotherboardCase(mobo, cabinet) {
    if (!mobo || !cabinet) return null;
    const moboFf = mobo.formFactor;
    const caseFfs = cabinet.formFactors;

    if (!moboFf) {
      return {
        status: "NO EVALUABLE",
        message: "Falta el factor de forma de la placa madre.",
        comparedValues: { moboFormFactor: null, caseFormFactors: caseFfs }
      };
    }
    if (!caseFfs || !Array.isArray(caseFfs)) {
      return {
        status: "NO EVALUABLE",
        message: "Falta los factores de forma soportados por el gabinete.",
        comparedValues: { moboFormFactor: moboFf, caseFormFactors: null }
      };
    }

    const moboFfClean = moboFf.trim().toLowerCase();
    const fits = caseFfs.some(ff => ff.trim().toLowerCase() === moboFfClean);

    return {
      status: fits ? "COMPATIBLE" : "INCOMPATIBLE",
      message: fits
        ? `Factor de forma de la placa madre (${moboFf}) es compatible con el gabinete.`
        : `El gabinete no soporta el factor de forma de la placa madre (${moboFf}). Gabinete soporta: ${caseFfs.join(", ")}.`,
      comparedValues: { moboFormFactor: moboFf, caseFormFactors: caseFfs }
    };
  }

  function checkCoolerCpu(cooler, cpu) {
    if (!cooler || !cpu) return null;
    const cpuSocket = cpu.socket;
    const coolerSockets = cooler.supportedSockets;

    if (!cpuSocket) {
      return {
        status: "NO EVALUABLE",
        message: "Falta el socket del procesador para validar compatibilidad de disipador.",
        comparedValues: { cpuSocket: null }
      };
    }
    if (!coolerSockets || !Array.isArray(coolerSockets)) {
      return {
        status: "NO EVALUABLE",
        message: "Falta la lista de sockets soportados en el disipador.",
        comparedValues: { cpuSocket: cpuSocket, coolerSockets: null }
      };
    }

    const cpuSockClean = cpuSocket.trim().toLowerCase();
    const compatible = coolerSockets.some(s => s.trim().toLowerCase() === cpuSockClean);

    return {
      status: compatible ? "COMPATIBLE" : "INCOMPATIBLE",
      message: compatible
        ? `El disipador es compatible con el socket del procesador (${cpuSocket}).`
        : `El disipador no tiene soporte para el socket del procesador (${cpuSocket}). Disipador soporta: ${coolerSockets.join(", ")}.`,
      comparedValues: { cpuSocket: cpuSocket, coolerSockets: coolerSockets }
    };
  }

  function checkCoolerCase(cooler, cabinet) {
    if (!cooler || !cabinet) return null;
    const coolerHeight = cooler.heightMm;
    const caseMaxHeight = cabinet.maxCoolerHeightMm;

    if (coolerHeight === undefined || coolerHeight === null) {
      return {
        status: "NO EVALUABLE",
        message: "Falta la altura del disipador.",
        comparedValues: { coolerHeight: null, caseMaxHeight: caseMaxHeight }
      };
    }
    if (caseMaxHeight === undefined || caseMaxHeight === null) {
      return {
        status: "NO EVALUABLE",
        message: "Falta la altura máxima de disipador soportada por el gabinete.",
        comparedValues: { coolerHeight: coolerHeight, caseMaxHeight: null }
      };
    }

    const fits = coolerHeight <= caseMaxHeight;
    return {
      status: fits ? "COMPATIBLE" : "INCOMPATIBLE",
      message: fits
        ? `La altura del disipador es compatible con el gabinete (${coolerHeight}mm vs Gabinete Max: ${caseMaxHeight}mm).`
        : `El disipador es demasiado alto para el gabinete (${coolerHeight}mm vs Altura Max Gabinete: ${caseMaxHeight}mm).`,
      comparedValues: { coolerHeight: coolerHeight, caseMaxHeight: caseMaxHeight }
    };
  }

  function checkStorageMotherboard(storages, mobo) {
    if (!storages || !mobo) return null;
    const m2Slots = mobo.m2Slots;

    if (m2Slots === undefined || m2Slots === null) {
      return {
        status: "NO EVALUABLE",
        message: "Falta cantidad de slots M.2 en la placa madre.",
        comparedValues: { m2Slots: null }
      };
    }

    const nvmeCount = storages.filter(s => s.interface && s.interface.trim().toUpperCase() === "NVME").length;
    if (nvmeCount === 0) return null;

    const hasEnoughSlots = nvmeCount <= m2Slots;
    return {
      status: hasEnoughSlots ? "COMPATIBLE" : "INCOMPATIBLE",
      message: hasEnoughSlots
        ? `La placa madre cuenta con suficientes slots M.2 NVMe (${nvmeCount} seleccionados vs ${m2Slots} disponibles).`
        : `Cantidad de unidades M.2 NVMe seleccionadas (${nvmeCount}) supera las ranuras disponibles en la placa madre (${m2Slots}).`,
      comparedValues: { selectedNvme: nvmeCount, moboM2Slots: m2Slots }
    };
  }

  function checkAllCompatibility(components) {
    const cpu = components.find(c => c.category === "cpu") || null;
    const mobo = components.find(c => c.category === "motherboard") || null;
    const ram = components.find(c => c.category === "ram") || null;
    const gpu = components.find(c => c.category === "gpu") || null;
    const psu = components.find(c => c.category === "psu") || null;
    const cabinet = components.find(c => c.category === "case") || null;
    const cooler = components.find(c => c.category === "cooler") || null;
    const storages = components.filter(c => c.category === "storage");

    const rules = [];

    function addRuleResult(name, result) {
      if (result) {
        result.ruleName = name;
        rules.push(result);
      }
    }

    addRuleResult("CPU ↔ Motherboard (Socket)", checkCpuMotherboard(cpu, mobo));
    addRuleResult("Motherboard ↔ RAM (Tipo & Velocidad)", checkMotherboardRam(mobo, ram));
    addRuleResult("GPU ↔ Gabinete (Espacio)", checkGpuCase(gpu, cabinet));
    addRuleResult("GPU ↔ Motherboard (PCIe Slot)", checkGpuMotherboard(gpu, mobo));
    addRuleResult("Fuente de Poder (Consumo Energético)", checkPsuPower(cpu, gpu, psu));
    addRuleResult("Motherboard ↔ Gabinete (Form Factor)", checkMotherboardCase(mobo, cabinet));
    addRuleResult("Disipador ↔ CPU (Socket)", checkCoolerCpu(cooler, cpu));
    addRuleResult("Disipador ↔ Gabinete (Altura)", checkCoolerCase(cooler, cabinet));
    addRuleResult("Almacenamiento NVMe ↔ Motherboard (Slots M.2)", checkStorageMotherboard(storages, mobo));

    let overallStatus = "COMPATIBLE";
    if (rules.some(r => r.status === "INCOMPATIBLE")) {
      overallStatus = "INCOMPATIBLE";
    } else if (rules.some(r => r.status === "ADVERTENCIA")) {
      overallStatus = "ADVERTENCIA";
    } else if (rules.some(r => r.status === "NO EVALUABLE")) {
      overallStatus = "NO EVALUABLE";
    }

    return {
      overallStatus: overallStatus,
      rulesEvaluated: rules
    };
  }

  return {
    checkCpuMotherboard,
    checkMotherboardRam,
    checkGpuCase,
    checkGpuMotherboard,
    checkPsuPower,
    checkMotherboardCase,
    checkCoolerCpu,
    checkCoolerCase,
    checkStorageMotherboard,
    checkAllCompatibility
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = CompatibilityEngine;
} else if (typeof window !== "undefined") {
  window.CompatibilityEngine = CompatibilityEngine;
}

import math

def check_cpu_motherboard(cpu, mobo):
    if cpu is None or mobo is None:
        return None
    cpu_socket = cpu.get("socket")
    mobo_socket = mobo.get("socket")
    
    if not cpu_socket:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta el dato de socket en el procesador.",
            "comparedValues": {"cpuSocket": None, "moboSocket": mobo_socket}
        }
    if not mobo_socket:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta el dato de socket en la placa madre.",
            "comparedValues": {"cpuSocket": cpu_socket, "moboSocket": None}
        }

    matches = cpu_socket.strip().lower() == mobo_socket.strip().lower()
    return {
        "status": "COMPATIBLE" if matches else "INCOMPATIBLE",
        "message": f"Socket del procesador y la placa madre coinciden ({cpu_socket})." if matches else f"El socket del procesador ({cpu_socket}) no es compatible con el de la placa madre ({mobo_socket}).",
        "comparedValues": {"cpuSocket": cpu_socket, "moboSocket": mobo_socket}
    }

def check_motherboard_ram(mobo, ram):
    if mobo is None or ram is None:
        return None
    mobo_ram_type = mobo.get("ramType")
    ram_type = ram.get("ramType")
    mobo_max_speed = mobo.get("maxRamSpeed")
    ram_speed = ram.get("speed")

    if not mobo_ram_type:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta el tipo de RAM soportado en la placa madre.",
            "comparedValues": {"moboRamType": None, "ramType": ram_type}
        }
    if not ram_type:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta el tipo de RAM en el módulo de memoria.",
            "comparedValues": {"moboRamType": mobo_ram_type, "ramType": None}
        }

    type_matches = mobo_ram_type.strip().lower() == ram_type.strip().lower()
    if not type_matches:
        return {
            "status": "INCOMPATIBLE",
            "message": f"Tipo de memoria incompatible. La placa madre soporta {mobo_ram_type} pero la RAM es {ram_type}.",
            "comparedValues": {"moboRamType": mobo_ram_type, "ramType": ram_type}
        }

    if mobo_max_speed is not None and ram_speed is not None:
        if ram_speed > mobo_max_speed:
            return {
                "status": "ADVERTENCIA",
                "message": f"La velocidad de la RAM ({ram_speed}MHz) excede la velocidad máxima oficial de la placa madre ({mobo_max_speed}MHz). Funcionará a velocidad degradada.",
                "comparedValues": {"moboMaxSpeed": mobo_max_speed, "ramSpeed": ram_speed}
            }

    return {
        "status": "COMPATIBLE",
        "message": f"RAM compatible en tipo ({mobo_ram_type}) y velocidad ({ram_speed or 'N/A'}MHz).",
        "comparedValues": {
            "moboRamType": mobo_ram_type,
            "ramType": ram_type,
            "moboMaxSpeed": mobo_max_speed,
            "ramSpeed": ram_speed
        }
    }

def check_gpu_case(gpu, cabinet):
    if gpu is None or cabinet is None:
        return None
    gpu_length = gpu.get("lengthMm")
    case_max_gpu = cabinet.get("maxGpuLengthMm")

    if gpu_length is None:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta la longitud de la placa de video.",
            "comparedValues": {"gpuLength": None, "caseMaxGpu": case_max_gpu}
        }
    if case_max_gpu is None:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta el despeje máximo de GPU en el gabinete.",
            "comparedValues": {"gpuLength": gpu_length, "caseMaxGpu": None}
        }

    fits = gpu_length <= case_max_gpu
    return {
        "status": "COMPATIBLE" if fits else "INCOMPATIBLE",
        "message": f"La placa de video cabe en el gabinete (Largo: {gpu_length}mm vs Gabinete: {case_max_gpu}mm max)." if fits else f"La placa de video es demasiado larga para el gabinete ({gpu_length}mm vs Max: {case_max_gpu}mm).",
        "comparedValues": {"gpuLength": gpu_length, "caseMaxGpu": case_max_gpu}
    }

def check_gpu_motherboard(gpu, mobo):
    if gpu is None or mobo is None:
        return None
    pcie_slots = mobo.get("pcieSlots")

    if pcie_slots is None:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta cantidad de slots PCIe en la placa madre.",
            "comparedValues": {"pcieSlots": None}
        }

    has_slot = pcie_slots >= 1
    return {
        "status": "COMPATIBLE" if has_slot else "INCOMPATIBLE",
        "message": f"La placa madre tiene slots PCIe disponibles ({pcie_slots})." if has_slot else "La placa madre seleccionada no cuenta con slots PCIe x16 para la placa de video.",
        "comparedValues": {"moboPcieSlots": pcie_slots}
    }

def check_psu_power(cpu, gpu, psu):
    if psu is None:
        return None
    psu_watts = psu.get("wattage")
    
    if not psu_watts:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta la potencia total de la fuente de alimentación.",
            "comparedValues": {"requiredWatts": None, "psuWatts": None}
        }

    cpu_tdp = cpu.get("tdp") if cpu else 0
    gpu_tdp = gpu.get("tdp") if gpu else 0

    if cpu and cpu_tdp is None:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta el TDP del procesador para estimar el consumo.",
            "comparedValues": {"psuWatts": psu_watts}
        }
    if gpu and gpu_tdp is None:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta el TDP de la placa de video para estimar el consumo.",
            "comparedValues": {"psuWatts": psu_watts}
        }

    # Estimar consumo: CPU + GPU + 50W (mobo, fans, ram, ssd) + 20% margen de seguridad
    base_consumption = (cpu_tdp or 0) + (gpu_tdp or 0) + 50
    required_watts = math.ceil(base_consumption * 1.20)
    sufficient = psu_watts >= required_watts

    return {
        "status": "COMPATIBLE" if sufficient else "INCOMPATIBLE",
        "message": f"Potencia de fuente suficiente. Consumo estimado (con +20% margen): {required_watts}W vs Fuente: {psu_watts}W." if sufficient else f"Potencia de la fuente insuficiente. Consumo estimado necesario (con +20% margen): {required_watts}W vs Fuente: {psu_watts}W.",
        "comparedValues": {"estimatedWatts": required_watts, "psuWatts": psu_watts, "cpuTdp": cpu_tdp, "gpuTdp": gpu_tdp}
    }

def check_motherboard_case(mobo, cabinet):
    if mobo is None or cabinet is None:
        return None
    mobo_ff = mobo.get("formFactor")
    case_ffs = cabinet.get("formFactors")

    if not mobo_ff:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta el factor de forma de la placa madre.",
            "comparedValues": {"moboFormFactor": None, "caseFormFactors": case_ffs}
        }
    if not case_ffs or not isinstance(case_ffs, list):
        return {
            "status": "NO EVALUABLE",
            "message": "Falta los factores de forma soportados por el gabinete.",
            "comparedValues": {"moboFormFactor": mobo_ff, "caseFormFactors": None}
        }

    mobo_ff_clean = mobo_ff.strip().lower()
    fits = any(ff.strip().lower() == mobo_ff_clean for ff in case_ffs)

    return {
        "status": "COMPATIBLE" if fits else "INCOMPATIBLE",
        "message": f"Factor de forma de la placa madre ({mobo_ff}) es compatible con el gabinete." if fits else f"El gabinete no soporta el factor de forma de la placa madre ({mobo_ff}). Gabinete soporta: {', '.join(case_ffs)}.",
        "comparedValues": {"moboFormFactor": mobo_ff, "caseFormFactors": case_ffs}
    }

def check_cooler_cpu(cooler, cpu):
    if cooler is None or cpu is None:
        return None
    cpu_socket = cpu.get("socket")
    cooler_sockets = cooler.get("supportedSockets")

    if not cpu_socket:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta el socket del procesador para validar compatibilidad de disipador.",
            "comparedValues": {"cpuSocket": None}
        }
    if not cooler_sockets or not isinstance(cooler_sockets, list):
        return {
            "status": "NO EVALUABLE",
            "message": "Falta la lista de sockets soportados en el disipador.",
            "comparedValues": {"cpuSocket": cpu_socket, "coolerSockets": None}
        }

    cpu_sock_clean = cpu_socket.strip().lower()
    compatible = any(s.strip().lower() == cpu_sock_clean for s in cooler_sockets)

    return {
        "status": "COMPATIBLE" if compatible else "INCOMPATIBLE",
        "message": f"El disipador es compatible con el socket del procesador ({cpu_socket})." if compatible else f"El disipador no tiene soporte para el socket del procesador ({cpu_socket}). Disipador soporta: {', '.join(cooler_sockets)}.",
        "comparedValues": {"cpuSocket": cpu_socket, "coolerSockets": cooler_sockets}
    }

def check_cooler_case(cooler, cabinet):
    if cooler is None or cabinet is None:
        return None
    cooler_height = cooler.get("heightMm")
    case_max_height = cabinet.get("maxCoolerHeightMm")

    if cooler_height is None:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta la altura del disipador.",
            "comparedValues": {"coolerHeight": None, "caseMaxHeight": case_max_height}
        }
    if case_max_height is None:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta la altura máxima de disipador soportada por el gabinete.",
            "comparedValues": {"coolerHeight": cooler_height, "caseMaxHeight": None}
        }

    fits = cooler_height <= case_max_height
    return {
        "status": "COMPATIBLE" if fits else "INCOMPATIBLE",
        "message": f"La altura del disipador es compatible con el gabinete ({cooler_height}mm vs Gabinete Max: {case_max_height}mm)." if fits else f"El disipador es demasiado alto para el gabinete ({cooler_height}mm vs Altura Max Gabinete: {case_max_height}mm).",
        "comparedValues": {"coolerHeight": cooler_height, "caseMaxHeight": case_max_height}
    }

def check_storage_motherboard(storages, mobo):
    if storages is None or mobo is None:
        return None
    m2_slots = mobo.get("m2Slots")

    if m2_slots is None:
        return {
            "status": "NO EVALUABLE",
            "message": "Falta cantidad de slots M.2 en la placa madre.",
            "comparedValues": {"m2Slots": None}
        }

    nvme_count = sum(1 for s in storages if s.get("interface") and s.get("interface").strip().upper() == "NVME")
    if nvme_count == 0:
        return None

    has_enough_slots = nvme_count <= m2_slots
    return {
        "status": "COMPATIBLE" if has_enough_slots else "INCOMPATIBLE",
        "message": f"La placa madre cuenta con suficientes slots M.2 NVMe ({nvme_count} seleccionados vs {m2_slots} disponibles)." if has_enough_slots else f"Cantidad de unidades M.2 NVMe seleccionadas ({nvme_count}) supera las ranuras disponibles en la placa madre ({m2_slots}).",
        "comparedValues": {"selectedNvme": nvme_count, "moboM2Slots": m2_slots}
    }

def check_all_compatibility(components):
    cpu = next((c for c in components if c.get("category") == "cpu"), None)
    mobo = next((c for c in components if c.get("category") == "motherboard"), None)
    ram = next((c for c in components if c.get("category") == "ram"), None)
    gpu = next((c for c in components if c.get("category") == "gpu"), None)
    psu = next((c for c in components if c.get("category") == "psu"), None)
    cabinet = next((c for c in components if c.get("category") == "case"), None)
    cooler = next((c for c in components if c.get("category") == "cooler"), None)
    storages = [c for c in components if c.get("category") == "storage"]

    rules = []

    def add_rule_result(name, result):
        if result:
            result["ruleName"] = name
            rules.append(result)

    add_rule_result("CPU ↔ Motherboard (Socket)", check_cpu_motherboard(cpu, mobo))
    add_rule_result("Motherboard ↔ RAM (Tipo & Velocidad)", check_motherboard_ram(mobo, ram))
    add_rule_result("GPU ↔ Gabinete (Espacio)", check_gpu_case(gpu, cabinet))
    add_rule_result("GPU ↔ Motherboard (PCIe Slot)", check_gpu_motherboard(gpu, mobo))
    add_rule_result("Fuente de Poder (Consumo Energético)", check_psu_power(cpu, gpu, psu))
    add_rule_result("Motherboard ↔ Gabinete (Form Factor)", check_motherboard_case(mobo, cabinet))
    add_rule_result("Disipador ↔ CPU (Socket)", check_cooler_cpu(cooler, cpu))
    add_rule_result("Disipador ↔ Gabinete (Altura)", check_cooler_case(cooler, cabinet))
    add_rule_result("Almacenamiento NVMe ↔ Motherboard (Slots M.2)", check_storage_motherboard(storages, mobo))

    # Determine overall status
    overall_status = "COMPATIBLE"
    if any(r["status"] == "INCOMPATIBLE" for r in rules):
        overall_status = "INCOMPATIBLE"
    elif any(r["status"] == "ADVERTENCIA" for r in rules):
        overall_status = "ADVERTENCIA"
    elif any(r["status"] == "NO EVALUABLE" for r in rules):
        overall_status = "NO EVALUABLE"

    return {
        "overallStatus": overall_status,
        "rulesEvaluated": rules
    }

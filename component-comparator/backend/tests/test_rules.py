import unittest
import sys
import os

# Adjust path to import rules
sys.path.append(os.path.join(os.path.dirname(__file__), "../src"))
# pyrefly: ignore [missing-import]
from rules import (
    check_cpu_motherboard,
    check_motherboard_ram,
    check_gpu_case,
    check_gpu_motherboard,
    check_psu_power,
    check_motherboard_case,
    check_cooler_cpu,
    check_cooler_case,
    check_storage_motherboard
)

class TestRulesCompatibility(unittest.TestCase):

    # 1. CPU <-> Motherboard
    def test_cpu_motherboard_compatible(self):
        res = check_cpu_motherboard({"socket": "AM5"}, {"socket": "AM5"})
        self.assertEqual(res["status"], "COMPATIBLE")

    def test_cpu_motherboard_incompatible(self):
        res = check_cpu_motherboard({"socket": "AM5"}, {"socket": "LGA1700"})
        self.assertEqual(res["status"], "INCOMPATIBLE")

    def test_cpu_motherboard_missing_data(self):
        res = check_cpu_motherboard({"socket": "AM5"}, {})
        self.assertEqual(res["status"], "NO EVALUABLE")

    # 2. Motherboard <-> RAM
    def test_motherboard_ram_compatible(self):
        res = check_motherboard_ram(
            {"ramType": "DDR5", "maxRamSpeed": 6400},
            {"ramType": "DDR5", "speed": 6000}
        )
        self.assertEqual(res["status"], "COMPATIBLE")

    def test_motherboard_ram_incompatible(self):
        res = check_motherboard_ram(
            {"ramType": "DDR5"},
            {"ramType": "DDR4"}
        )
        self.assertEqual(res["status"], "INCOMPATIBLE")

    def test_motherboard_ram_warning(self):
        res = check_motherboard_ram(
            {"ramType": "DDR5", "maxRamSpeed": 6000},
            {"ramType": "DDR5", "speed": 6400}
        )
        self.assertEqual(res["status"], "ADVERTENCIA")

    # 3. GPU <-> Case
    def test_gpu_case_compatible(self):
        res = check_gpu_case({"lengthMm": 320}, {"maxGpuLengthMm": 360})
        self.assertEqual(res["status"], "COMPATIBLE")

    def test_gpu_case_incompatible(self):
        res = check_gpu_case({"lengthMm": 336}, {"maxGpuLengthMm": 250})
        self.assertEqual(res["status"], "INCOMPATIBLE")

    # 4. GPU <-> Motherboard
    def test_gpu_motherboard_compatible(self):
        res = check_gpu_motherboard({}, {"pcieSlots": 2})
        self.assertEqual(res["status"], "COMPATIBLE")

    def test_gpu_motherboard_incompatible(self):
        res = check_gpu_motherboard({}, {"pcieSlots": 0})
        self.assertEqual(res["status"], "INCOMPATIBLE")

    # 5. PSU wattage
    def test_psu_power_compatible(self):
        res = check_psu_power({"tdp": 120}, {"tdp": 285}, {"wattage": 750})
        self.assertEqual(res["status"], "COMPATIBLE")

    def test_psu_power_incompatible(self):
        res = check_psu_power({"tdp": 170}, {"tdp": 355}, {"wattage": 600})
        self.assertEqual(res["status"], "INCOMPATIBLE")

    # 6. Motherboard <-> Case
    def test_motherboard_case_compatible(self):
        res = check_motherboard_case({"formFactor": "ATX"}, {"formFactors": ["ATX", "Micro-ATX"]})
        self.assertEqual(res["status"], "COMPATIBLE")

    def test_motherboard_case_incompatible(self):
        res = check_motherboard_case({"formFactor": "ATX"}, {"formFactors": ["Micro-ATX"]})
        self.assertEqual(res["status"], "INCOMPATIBLE")

    # 7. Cooler <-> CPU
    def test_cooler_cpu_compatible(self):
        res = check_cooler_cpu({"supportedSockets": ["AM4", "AM5"]}, {"socket": "AM5"})
        self.assertEqual(res["status"], "COMPATIBLE")

    def test_cooler_cpu_incompatible(self):
        res = check_cooler_cpu({"supportedSockets": ["LGA1700"]}, {"socket": "AM5"})
        self.assertEqual(res["status"], "INCOMPATIBLE")

    # 8. Cooler <-> Case
    def test_cooler_case_compatible(self):
        res = check_cooler_case({"heightMm": 155}, {"maxCoolerHeightMm": 170})
        self.assertEqual(res["status"], "COMPATIBLE")

    def test_cooler_case_incompatible(self):
        res = check_cooler_case({"heightMm": 165}, {"maxCoolerHeightMm": 150})
        self.assertEqual(res["status"], "INCOMPATIBLE")

    # 9. Storage NVMe <-> Motherboard
    def test_storage_motherboard_compatible(self):
        res = check_storage_motherboard(
            [{"interface": "NVMe"}, {"interface": "NVMe"}],
            {"m2Slots": 3}
        )
        self.assertEqual(res["status"], "COMPATIBLE")

    def test_storage_motherboard_incompatible(self):
        res = check_storage_motherboard(
            [{"interface": "NVMe"}, {"interface": "NVMe"}, {"interface": "NVMe"}],
            {"m2Slots": 2}
        )
        self.assertEqual(res["status"], "INCOMPATIBLE")

if __name__ == "__main__":
    unittest.main()

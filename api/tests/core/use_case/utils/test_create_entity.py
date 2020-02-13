import unittest
from enum import Enum

from classes.blueprint import Blueprint
from classes.dto import DTO
from core.repository.file import TemplateRepositoryFromFile
from core.use_case.utils.create_entity import CreateEntity
from utils.helper_functions import schemas_location


class Types(Enum):
    BLUEPRINT = "system/SIMOS/Blueprint"
    BLUEPRINT_ATTRIBUTE = "system/SIMOS/BlueprintAttribute"


class CreateEntityTestCase(unittest.TestCase):
    def setUp(self):
        self.maxDiff = None

    def test_blueprint_entity(self):
        expected_entity = {
            "engine2": {},
            "engine": {
                "description": "",
                "fuelPump": {
                    "name": "fuelpumptest",
                    "description": "A standard fuel pump",
                    "type": "ds/test_data/complex/FuelPumpTest",
                },
                "power": 120,
                "type": "ds/test_data/complex/EngineTest",
            },
            "is_sedan": True,
            "description": "crappy car",
            "name": "Mercedes",
            "seats": 2,
            "type": "ds/test_data/complex/CarTest",
            "wheel": {"name": "Wheel", "power": 0.0, "type": "ds/test_data/complex/WheelTest"},
            "wheels": [],
            "floatValues": [2.1, 3.1, 4.2],
            "intValues": [1, 5, 4, 2],
            "boolValues": [True, False, True],
            "stringValues": ["one", "two", "three"],
        }

        file_repository_test = TemplateRepositoryFromFile(schemas_location())

        class BlueprintProvider:
            def get_blueprint(self, template_type: str):
                return Blueprint(DTO(file_repository_test.get(template_type)))

        type = "ds/test_data/complex/CarTest"

        entity = CreateEntity(
            blueprint_provider=BlueprintProvider(), type=type, description="crappy car", name="Mercedes"
        ).entity

        self.assertEqual(expected_entity, entity)

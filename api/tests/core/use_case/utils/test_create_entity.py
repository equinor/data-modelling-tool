import unittest
from classes.blueprint import Blueprint
from classes.blueprint_attribute import BlueprintAttribute
from classes.dto import DTO
from core.repository.file import LocalFileRepository
from core.use_case.utils.create_entity import CreateEntity


class CreateEntityTestCase(unittest.TestCase):
    def setUp(self):
        self.maxDiff = None

    def test_blueprint_entity(self):
        expected_entity = {
            "engine2": {},
            "engine": {
                "name": "engine",
                "description": "",
                "fuelPump": {
                    "name": "fuelPump",
                    "description": "A standard fuel pump",
                    "type": "test_data/complex/FuelPumpTest",
                },
                "power": 120,
                "type": "test_data/complex/EngineTest",
            },
            "is_sedan": True,
            "description": "crappy car",
            "name": "Mercedes",
            "seats": 2,
            "type": "test_data/complex/CarTest",
            "wheel": {"name": "wheel", "power": 0.0, "type": "test_data/complex/WheelTest"},
            "wheels": [],
            "floatValues": [2.1, 3.1, 4.2],
            "intValues": [1, 5, 4, 2],
            "boolValues": [True, False, True],
            "stringValues": ["one", "two", "three"],
        }

        file_repository_test = LocalFileRepository()

        class BlueprintProvider:
            def get_blueprint(self, template_type: str):
                return Blueprint(DTO(file_repository_test.get(template_type)))

        type = "test_data/complex/CarTest"

        entity = CreateEntity(
            blueprint_provider=BlueprintProvider(), type=type, description="crappy car", name="Mercedes"
        ).entity

        self.assertEqual(expected_entity, entity)

    def test_is_not_json(self):
        self.assertEqual(False, CreateEntity.is_json(BlueprintAttribute(name="", attribute_type="", default="")))
        self.assertEqual(
            False, CreateEntity.is_json(BlueprintAttribute(name="", attribute_type="", default=" [] some"))
        )

    def test_is_json(self):
        self.assertEqual(True, CreateEntity.is_json(BlueprintAttribute(name="", attribute_type="", default=" [] ")))
        self.assertEqual(
            True, CreateEntity.is_json(BlueprintAttribute(name="", attribute_type="", default=' {"foo": "bar"} '))
        )

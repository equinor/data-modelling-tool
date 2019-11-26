import unittest
from typing import Optional
from core.repository.file.document_repository import TemplateRepositoryFromFile


from enum import Enum

from core.domain.schema import Factory
from core.use_case.utils.create_entity import CreateEntity
from utils.helper_functions import schemas_location


class Types(Enum):
    BLUEPRINT = "system/SIMOS/Blueprint"
    BLUEPRINT_ATTRIBUTE = "system/SIMOS/BlueprintAttribute"

class CreateEntityTestCase(unittest.TestCase):
    def setUp(self):
        self.maxDiff = None

    def test_blueprint_entity(self):
        expected_entity ={
            'engine': {
                'description': '',
                'fuelPump': {
                    'name': '',
                    'description': '',
                    'type': 'ds/test_data/complex/FuelPumpTest'
                },
                'power': 120,
                'type': 'ds/test_data/complex/EngineTest'
            },
            'is_sedan': True,
            'name': 'CarTest',
            'seats': 2,
            'type': 'ds/test_data/complex/CarTest',
            'wheel': {
                'name': 'Wheel',
                'power': 0.0,
                'type': 'ds/test_data/WheelTest'
            },
            "wheels": []
        }

        blueprint_provider = BlueprintProviderTest()
        car_blueprint = blueprint_provider.get_blueprint('ds/test_data/complex/CarTest')
        print(car_blueprint)
        entity = CreateEntity(blueprint_provider=blueprint_provider).get_entity(car_blueprint)

        self.assertEqual(expected_entity, entity)


class BlueprintProviderTest:
    def __init__(self):
        file_repository_test = TemplateRepositoryFromFile(schemas_location())
        self._factory_test = Factory(template_repository=file_repository_test, read_from_file=True)

    def get_blueprint(self, template_type: str) -> Optional[type]:
       return self._factory_test.create(template_type)



import unittest


from api.classes.dto import DTO
from api.core.service.document_service import DocumentService
from classes.blueprint import Blueprint
from core.repository.file import TemplateRepositoryFromFile
from utils.helper_functions import schemas_location

basic_blueprint = {
    "type": "system/SIMOS/Blueprint",
    "name": "A box",
    "description": "First blueprint",
    "attributes": [
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "description"},
        {"attributeType": "integer", "type": "system/SIMOS/BlueprintAttribute", "name": "length"},
    ],
}

file_repository_test = TemplateRepositoryFromFile(schemas_location())


class BlueprintProvider:
    def get_blueprint(self, type: str):
        if type == "basic_blueprint":
            return Blueprint(DTO(basic_blueprint))
        else:
            return Blueprint(DTO(file_repository_test.get(type)))


class InstantiateEntity(unittest.TestCase):
    def test_instantiate_simple(self):
        document_service = DocumentService(blueprint_provider=BlueprintProvider())
        expected = {"name": "myName", "description": "", "type": "basic_blueprint", "length": 0}
        entity = document_service.instantiate_entity("basic_blueprint", "myName")

        assert expected == entity

    @unittest.skip
    def test_instantiate_blueprint(self):
        document_service = DocumentService(blueprint_provider=BlueprintProvider())
        expected = {"name": "myBlueprint", "description": "", "type": "basic_blueprint", "length": 0}
        entity = document_service.instantiate_entity("system/SIMOS/Blueprint", "myBlueprint")

        assert expected == entity

import unittest

from domain_classes.blueprint import Blueprint
from repository.file import LocalFileRepository
from services.application_service import ApplicationService
from services.document_service import DocumentService

test_blueprints = {
    "basic_blueprint": {
        "type": "system/SIMOS/Blueprint",
        "name": "box",
        "description": "First blueprint",
        "attributes": [
            {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
            {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
            {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "description"},
            {"attributeType": "integer", "type": "system/SIMOS/BlueprintAttribute", "name": "length"},
        ],
    },
    "car_blueprint": {
        "type": "system/SIMOS/Blueprint",
        "name": "Car",
        "attributes": [
            {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
            {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
            {
                "attributeType": "string",
                "type": "system/SIMOS/BlueprintAttribute",
                "name": "description",
                "default": "This is the default description",
            },
            {
                "attributeType": "engine_blueprint",
                "type": "system/SIMOS/BlueprintAttribute",
                "name": "requiredEngine",
                "optional": False,
            },
            {
                "attributeType": "engine_blueprint",
                "type": "system/SIMOS/BlueprintAttribute",
                "name": "optionalEngine",
                "optional": True,
            },
            {"attributeType": "integer", "type": "system/SIMOS/BlueprintAttribute", "name": "seats", "default": 2},
            {
                "attributeType": "boolean",
                "type": "system/SIMOS/BlueprintAttribute",
                "name": "is_sedan",
                "default": True,
            },
            {
                "attributeType": "wheel_blueprint",
                "type": "system/SIMOS/BlueprintAttribute",
                "name": "wheels",
                "dimensions": "2",
            },
            {
                "attributeType": "number",
                "type": "system/SIMOS/BlueprintAttribute",
                "name": "floatValues",
                "dimensions": "*",
            },
            {
                "attributeType": "integer",
                "type": "system/SIMOS/BlueprintAttribute",
                "name": "intValues",
                "dimensions": "*",
                "default": [1, 2, 3],
            },
            {
                "attributeType": "string",
                "type": "system/SIMOS/BlueprintAttribute",
                "name": "stringValues",
                "dimensions": "3",
            },
            {
                "attributeType": "boolean",
                "type": "system/SIMOS/BlueprintAttribute",
                "name": "boolValues",
                "dimensions": "*",
                "default": [True, False, True],
            },
        ],
    },
    "engine_blueprint": {
        "type": "system/SIMOS/Blueprint",
        "name": "engine",
        "attributes": [
            {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
            {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
            {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "description"},
            {"attributeType": "number", "type": "system/SIMOS/BlueprintAttribute", "name": "power", "default": 120},
        ],
    },
    "wheel_blueprint": {
        "type": "system/SIMOS/Blueprint",
        "name": "wheel",
        "attributes": [
            {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
            {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "description"},
            {"attributeType": "integer", "type": "system/SIMOS/BlueprintAttribute", "name": "diameter"},
        ],
    },
}


file_repository_test = LocalFileRepository()


def get_blueprint(type: str):
    try:
        return Blueprint(test_blueprints[type])
    except KeyError:
        return Blueprint(file_repository_test.get(type))


class InstantiateEntity(unittest.TestCase):
    def test_instantiate_simple(self):
        document_service = DocumentService(blueprint_provider=get_blueprint)
        application_service = ApplicationService(document_service)
        expected = {"name": "myName", "description": "", "type": "basic_blueprint", "length": 0}
        entity = application_service.instantiate_entity({"type": "basic_blueprint", "name": "myName"})

        assert expected == entity

    def test_instantiate_blueprint(self):
        document_service = DocumentService(blueprint_provider=get_blueprint)
        application_service = ApplicationService(document_service)
        expected = {"name": "myBlueprint", "description": "", "type": "system/SIMOS/Blueprint"}
        entity = application_service.instantiate_entity({"type": "system/SIMOS/Blueprint", "name": "myBlueprint"})

        for k, v in expected.items():
            assert entity[k] == v

    def test_create_complex_entity(self):
        expected_entity = {
            "type": "car_blueprint",
            "name": "mercedes",
            "description": "This is the default description",
            "optionalEngine": {},
            "requiredEngine": {
                "name": "engine",
                "description": "",
                "power": 120,
                "type": "engine_blueprint",
            },
            "is_sedan": True,
            "seats": 2,
            "wheels": [
                {"description": "", "diameter": None, "name": "0", "type": "wheel_blueprint"},
                {"description": "", "diameter": None, "name": "1", "type": "wheel_blueprint"},
            ],
            "floatValues": [],
            "intValues": [1, 2, 3],
            "boolValues": [True, False, True],
            "stringValues": ["", "", ""],
        }
        document_service = DocumentService(blueprint_provider=get_blueprint)
        application_service = ApplicationService(document_service)

        entity = application_service.instantiate_entity({"type": "car_blueprint", "name": "mercedes"})

        assert entity["name"] == expected_entity["name"]
        assert entity["optionalEngine"] == expected_entity["optionalEngine"]
        assert entity["requiredEngine"]["power"] == expected_entity["requiredEngine"]["power"]
        assert entity["requiredEngine"]["type"] == expected_entity["requiredEngine"]["type"]
        assert entity["is_sedan"] == expected_entity["is_sedan"]
        assert entity["seats"] == expected_entity["seats"]
        assert entity["floatValues"] == expected_entity["floatValues"]
        assert entity["intValues"] == expected_entity["intValues"]
        assert entity["boolValues"] == expected_entity["boolValues"]
        assert entity["stringValues"] == expected_entity["stringValues"]
        assert entity["wheels"][1]["name"] == expected_entity["wheels"][1]["name"]

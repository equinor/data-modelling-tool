import unittest

from classes.blueprint import Blueprint
from classes.dimension import Dimension
from classes.dto import DTO
from core.repository.file import TemplateRepositoryFromFile
from core.use_case.utils.create_entity import CreateEntity
from utils.helper_functions import schemas_location

package_blueprint = {
    "type": "system/SIMOS/Blueprint",
    "name": "Package",
    "description": "This is a blueprint for a package that contains documents and other packages",
    "attributes": [
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
        {
            "attributeType": "string",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "description",
            "optional": True,
        },
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
        {"attributeType": "boolean", "type": "system/SIMOS/BlueprintAttribute", "name": "isRoot"},
        {
            "attributeType": "system/DMT/Entity",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "content",
            "dimensions": "*",
            "optional": True,
        },
    ],
    "storageRecipes": [
        {
            "type": "system/SIMOS/StorageRecipe",
            "name": "DefaultStorageRecipe",
            "description": "",
            "attributes": [{"name": "content", "type": "system/DMT/Entity", "contained": False},],
        }
    ],
}

basic_blueprint = {
    "type": "system/SIMOS/Blueprint",
    "name": "A box",
    "description": "First blueprint",
    "attributes": [
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "description"},
        {"attributeType": "integer", "type": "system/SIMOS/BlueprintAttribute", "name": "length",},
    ],
}

higher_rank_array_blueprint = {
    "type": "system/SIMOS/Blueprint",
    "name": "Higher rank integer arrays",
    "description": "First blueprint",
    "attributes": [
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "description"},
        {
            "attributeType": "integer",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "1_dim-unfixed",
            "dimensions": "*",
        },
        {
            "attributeType": "basic_blueprint",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "1_dim-fixed_complex_type",
            "dimensions": "5",
        },
        {
            "attributeType": "integer",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "2_dim-unfixed",
            "dimensions": "*,*",
        },
        {
            "attributeType": "integer",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "3_dim-mix",
            "dimensions": "*,1,100",
        },
    ],
}

file_repository_test = TemplateRepositoryFromFile(schemas_location())


class BlueprintProvider:
    def get_blueprint(self, template_type: str):
        if template_type == "higher_rank_array":
            return Blueprint(DTO(higher_rank_array_blueprint))
        elif template_type == "package_blueprint":
            return Blueprint(DTO(package_blueprint))
        elif template_type == "basic_blueprint":
            return Blueprint(DTO(basic_blueprint))
        else:
            return Blueprint(DTO(file_repository_test.get(template_type)))


blueprint_provider = BlueprintProvider()


class DefaultArrayTestCase(unittest.TestCase):
    def test_creation_of_default_array_simple(self):
        default_array = Dimension("*", "integer").create_default_array(blueprint_provider, CreateEntity)

        assert default_array == []

    def test_creation_of_default_array_complex_type(self):
        default_array = Dimension("1,1", "system/DMT/Package").create_default_array(blueprint_provider, CreateEntity)

        assert default_array == [
            [{"name": "0", "description": "", "type": "system/DMT/Package", "isRoot": False, "content": []}]
        ]

    def test_creation_of_default_array_unfixed_rank2(self):
        default_array = Dimension("*,*", "integer").create_default_array(blueprint_provider, CreateEntity)

        assert default_array == [[]]

    def test_creation_of_default_array_fixed_rank2(self):
        default_array = Dimension("2,1", "integer").create_default_array(blueprint_provider, CreateEntity)
        # fmt: off
        assert default_array == [
            [0],
            [0],
        ]
        # fmt: on

    def test_creation_of_default_array_mixed_rank_string(self):
        default_array = Dimension("2,*,3", "string").create_default_array(blueprint_provider, CreateEntity)
        # fmt: off
        assert default_array == [
            [["", "", ""]],
            [["", "", ""]],
        ]
        # fmt: on

    def test_creation_of_default_array_mixed_rank3_int(self):
        default_array = Dimension("2,2,*", "integer").create_default_array(blueprint_provider, CreateEntity)
        expected = [[[], []], [[], []]]

        assert default_array == expected

    def test_creation_of_default_array_mixed_rank3_bool(self):
        default_array = Dimension("1,2,1", "boolean").create_default_array(blueprint_provider, CreateEntity)
        expected = [[[False], [False]]]

        assert default_array == expected


if __name__ == "__main__":
    unittest.main()

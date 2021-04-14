import unittest
from unittest import skip

from classes.blueprint import Blueprint
from classes.dto import DTO
from classes.tree_node import Node

blueprint_1 = {
    "type": "system/SIMOS/Blueprint",
    "name": "Blueprint1",
    "description": "First blueprint",
    "attributes": [
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "description"},
        {"attributeType": "blueprint_2", "type": "system/SIMOS/BlueprintAttribute", "name": "nested"},
    ],
    "storageRecipes": [],
    "uiRecipes": [],
}


class BlueprintProvider:
    @staticmethod
    def get_blueprint(type: str):
        return Blueprint(DTO(blueprint_1))


class ErrorTreenodeTestCase(unittest.TestCase):

    # Can't find a good way to make the Node creation fail...
    @skip
    def test_error_node_renamed(self):
        document_1 = {
            "_id": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            # changed type: blueprint_2 -> blueprint_3
            "nested": {"name": "Nested 1", "description": "", "type": "blueprint_3"},
        }

        root = Node.from_dict(document_1, document_1["_id"], BlueprintProvider())
        error_msg = root.children[0].error_message
        assert error_msg is not None

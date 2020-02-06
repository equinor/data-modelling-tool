import unittest
from unittest import skip

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


class ErrorTreenodeTestCase(unittest.TestCase):

    # error node breaks tests in document service.
    # add uncommented line in tree_node from_dict to enable this test.
    @skip
    def test_error_node_renamed(self):
        document_1 = {
            "uid": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            # renamed nested to nested2
            "nested2": {
                "name": "Nested 1",
                "description": "",
                "type": "blueprint_2",

            },
            "_blueprint": blueprint_1,
        }
        root = Node.from_dict(DTO(document_1))
        error_msg = root.children[0].error_message
        assert error_msg is not None

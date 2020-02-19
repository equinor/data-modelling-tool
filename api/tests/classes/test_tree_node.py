import unittest
from classes.blueprint import Blueprint
from classes.dto import DTO
from tests.util_tests import flatten_dict
from utils.data_structure.compare import pretty_eq

from classes.tree_node import Node, ListNode, DictExporter, DictImporter

blueprint_1 = {
    "type": "system/SIMOS/Blueprint",
    "name": "Blueprint1",
    "description": "First blueprint",
    "attributes": [
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "description"},
        {"attributeType": "blueprint_2", "type": "system/SIMOS/BlueprintAttribute", "name": "nested"},
        {"attributeType": "blueprint_2", "type": "system/SIMOS/BlueprintAttribute", "name": "reference"},
        {
            "attributeType": "blueprint_2",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "references",
            "dimensions": "*",
        },
    ],
    "storageRecipes": [
        {
            "type": "system/SIMOS/StorageRecipe",
            "name": "DefaultStorageRecipe",
            "description": "",
            "attributes": [
                {"name": "reference", "type": "system/DMT/Entity", "contained": False},
                {"name": "references", "type": "system/DMT/Entity", "contained": False},
            ],
        }
    ],
    "uiRecipes": [],
}

blueprint_2 = {
    "type": "system/SIMOS/Blueprint",
    "name": "Blueprint2",
    "description": "Second blueprint",
    "attributes": [
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "description"},
        {"attributeType": "blueprint_3", "type": "system/SIMOS/BlueprintAttribute", "name": "nested"},
    ],
    "storageRecipes": [],
    "uiRecipes": [],
}

blueprint_3 = {
    "type": "system/SIMOS/Blueprint",
    "name": "Blueprint3",
    "description": "Second blueprint",
    "attributes": [
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "description"},
        {"attributeType": "blueprint_2", "type": "system/SIMOS/BlueprintAttribute", "name": "reference"},
    ],
    "storageRecipes": [],
    "uiRecipes": [],
}

blueprint_4 = {
    "type": "system/SIMOS/Blueprint",
    "name": "Blueprint4",
    "description": "Second blueprint",
    "attributes": [
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "description"},
        {
            "attributeType": "blueprint_4",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "a_list",
            "dimensions": "*",
        },
    ],
    "storageRecipes": [],
    "uiRecipes": [],
}


class BlueprintProvider:
    def get_blueprint(self, type: str):
        if type == "blueprint_1":
            return Blueprint(DTO(data=blueprint_1))
        if type == "blueprint_2":
            return Blueprint(DTO(data=blueprint_1))
        if type == "blueprint_3":
            return Blueprint(DTO(data=blueprint_1))
        if type == "blueprint_4":
            return Blueprint(DTO(data=blueprint_4))
        return None


blueprint_provider = BlueprintProvider()


class TreenodeTestCase(unittest.TestCase):
    def test_is_root(self):
        root_data = {"uid": 1, "name": "root", "description": "", "type": "blueprint_1"}
        root = Node(key="root", uid="1", entity=root_data, blueprint_provider=blueprint_provider)

        nested_data = {"name": "Nested", "description": "", "type": "blueprint_2"}
        nested = Node(
            key="nested", uid="", entity=nested_data, blueprint_provider=blueprint_provider, parent=root
        )

        assert root.is_root()
        assert not nested.is_root()

    def test_replace(self):
        root_data = {"uid": 1, "name": "root", "description": "", "type": "blueprint_1"}
        root = Node(key="root", uid="1", entity=root_data, blueprint_provider=blueprint_provider)

        nested_1_data = {"name": "Nested 1", "description": "", "type": "blueprint_2"}
        nested_1 = Node(
            key="nested", uid="", entity=nested_1_data, blueprint_provider=blueprint_provider, parent=root
        )

        nested_2_data = {"name": "Nested 2", "description": "", "type": "blueprint_2"}
        nested_2 = Node(key="nested", uid="", entity=nested_2_data, blueprint_provider=blueprint_provider)

        actual_before = {
            "_id": "1",
            "uid": "1",
            "name": "root",
            "description": "",
            "type": "blueprint_1",
            "nested": {"name": "Nested 1", "description": "", "type": "blueprint_2"},
        }

        assert actual_before == root.to_dict()

        root.replace("1.nested", nested_2)

        actual_after_replaced = {
            "_id": "1",
            "uid": "1",
            "name": "root",
            "description": "",
            "type": "blueprint_1",
            "nested": {"name": "Nested 2", "description": "", "type": "blueprint_2"},
        }

        assert actual_after_replaced == root.to_dict()

    def test_delete_root_child(self):
        root_data = {"uid": 1, "name": "root", "description": "", "type": "blueprint_1"}
        root = Node(key="root", uid="1", entity=root_data, blueprint_provider=blueprint_provider)

        nested_1_data = {"name": "Nested 1", "description": "", "type": "blueprint_2"}
        nested_1 = Node(
            key="nested", uid="", entity=nested_1_data, blueprint_provider=blueprint_provider, parent=root
        )

        actual_before = {
            "_id": "1",
            "uid": "1",
            "name": "root",
            "description": "",
            "type": "blueprint_1",
            "nested": {"name": "Nested 1", "description": "", "type": "blueprint_2"},
        }

        assert actual_before == root.to_dict()

        root.remove_by_path(["nested"])

        actual_after_delete = {"_id": "1", "uid": "1", "name": "root", "description": "", "type": "blueprint_1"}

        assert actual_after_delete == root.to_dict()

    def test_delete_nested_child(self):
        root_data = {"uid": 1, "name": "root", "description": "", "type": "blueprint_1"}
        root = Node(key="root", uid="1", entity=root_data, blueprint_provider=blueprint_provider)

        nested_1_data = {"name": "Nested 1", "description": "", "type": "blueprint_2"}
        nested_1 = Node(
            key="nested", uid="", entity=nested_1_data, blueprint_provider=blueprint_provider, parent=root
        )
        nested_2_data = {"name": "Nested 2", "description": "", "type": "blueprint_3"}
        nested_2 = Node(
            key="nested2", uid="", entity=nested_2_data, blueprint_provider=blueprint_provider, parent=nested_1
        )

        actual_before = {
            "_id": "1",
            "uid": "1",
            "name": "root",
            "description": "",
            "type": "blueprint_1",
            "nested": {
                "name": "Nested 1",
                "description": "",
                "type": "blueprint_2",
                "nested2": {"name": "Nested 2", "description": "", "type": "blueprint_3"},
            },
        }

        assert actual_before == root.to_dict()

        root.remove_by_path(["nested", "nested2"])

        actual_after_delete = {
            "_id": "1",
            "uid": "1",
            "name": "root",
            "description": "",
            "type": "blueprint_1",
            "nested": {"name": "Nested 1", "description": "", "type": "blueprint_2"},
        }

        assert actual_after_delete == root.to_dict()

    def test_delete_list_element_of_nested_child(self):
        document = {
            "_id": "1",
            "uid": "1",
            "name": "root",
            "description": "",
            "type": "blueprint_4",
            "a_list": [
                {
                    "name": "Nested 1",
                    "description": "",
                    "type": "blueprint_4",
                    "a_list": [
                        {"name": "Nested 2 index 0", "description": "", "type": "blueprint_4", "a_list": []},
                        {"name": "Nested 2 index 1", "description": "", "type": "blueprint_4", "a_list": []},
                    ],
                }
            ],
        }
        root = Node.from_dict(DTO(document), blueprint_provider)

        actual_before = {
            "_id": "1",
            "uid": "1",
            "name": "root",
            "description": "",
            "type": "blueprint_4",
            "a_list": [
                {
                    "name": "Nested 1",
                    "description": "",
                    "type": "blueprint_4",
                    "a_list": [
                        {"name": "Nested 2 index 0", "description": "", "type": "blueprint_4", "a_list": []},
                        {"name": "Nested 2 index 1", "description": "", "type": "blueprint_4", "a_list": []},
                    ],
                }
            ],
        }

        assert actual_before == root.to_dict()

        root.remove_by_path(["a_list", "0", "a_list", "1"])

        actual_after_delete = {
            "_id": "1",
            "uid": "1",
            "name": "root",
            "description": "",
            "type": "blueprint_4",
            "a_list": [
                {
                    "name": "Nested 1",
                    "description": "",
                    "type": "blueprint_4",
                    "a_list": [{"name": "Nested 2 index 0", "description": "", "type": "blueprint_4", "a_list": []}],
                }
            ],
        }

        assert actual_after_delete == root.to_dict()

    def test_depth(self):
        root_data = {"uid": 1, "name": "root", "description": "", "type": "blueprint_1"}
        root = Node(key="root", uid="1", entity=root_data, blueprint_provider=blueprint_provider)

        nested_data = {"name": "Nested", "description": "", "type": "blueprint_2"}
        nested = Node(
            key="nested", uid="", entity=nested_data, blueprint_provider=blueprint_provider, parent=root
        )

        assert root.depth() == 0
        assert nested.depth() == 1

    def test_traverse(self):
        document_1 = {
            "uid": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {
                "name": "Nested 1",
                "description": "",
                "type": "blueprint_2",
                "nested": {
                    "name": "Nested 2",
                    "description": "",
                    "type": "blueprint_3",
                    "reference": {
                        "_id": "2",
                        "uid": "2",
                        "name": "Reference",
                        "description": "",
                        "type": "blueprint_2",
                    },
                },
            },
        }

        root = Node.from_dict(DTO(document_1), blueprint_provider)
        result = [node.name for node in root.traverse()]
        # with error nodes
        # expected = ["Parent", "Nested 1", "Nested 2", "Reference", "nested", "reference", "references"]
        expected = [
            "Parent",
            "Nested 1",
            "Nested 2",
            "Reference",
            "references",
            "references",
            "references",
            "references",
        ]
        assert result == expected

    def test_traverse_reverse(self):
        root_data = {"uid": 1, "name": "root", "description": "", "type": "blueprint_1"}
        root = Node(key="root", uid="1", entity=root_data, blueprint_provider=blueprint_provider)

        nested_data = {"name": "Nested 1", "description": "", "type": "blueprint_2"}
        nested = Node(
            key="nested", uid="", entity=nested_data, blueprint_provider=blueprint_provider, parent=root
        )

        nested_2_data = {"name": "Nested 2", "description": "", "type": "blueprint_3"}
        nested_2 = Node(
            key="nested", uid="", entity=nested_2_data, blueprint_provider=blueprint_provider, parent=nested
        )

        result = [node.name for node in nested_2.traverse_reverse()]
        expected = ["Nested 2", "Nested 1", "root"]
        assert result == expected

    def test_node_id(self):
        root_data = {"uid": 1, "name": "root", "description": "", "type": "blueprint_1"}
        root = Node(key="root", uid="1", entity=root_data, blueprint_provider=blueprint_provider)

        nested_data = {"name": "Nested", "description": "", "type": "blueprint_2"}
        nested = Node(
            key="nested", uid="", entity=nested_data, blueprint_provider=blueprint_provider, parent=root
        )

        nested_2_data = {"name": "Nested", "description": "", "type": "blueprint_3"}
        nested_2 = Node(
            key="nested", uid="", entity=nested_2_data, blueprint_provider=blueprint_provider, parent=nested
        )

        nested_2_reference_data = {"uid": "2", "name": "Reference", "description": "", "type": "blueprint_2"}
        reference = Node(
            key="reference",
            uid="2",
            entity=nested_2_reference_data,
            blueprint_provider=blueprint_provider,
            parent=nested_2,
        )

        list_data = {"name": "List", "type": "blueprint_3"}
        list_node = ListNode(
            key="list", uid="", entity=list_data, blueprint_provider=blueprint_provider, parent=root
        )

        item_1_data = {"name": "Item 1", "description": "", "type": "blueprint_2"}
        item_1 = Node(
            key="0", uid="", entity=item_1_data, blueprint_provider=blueprint_provider, parent=list_node
        )

        assert root.node_id == "1"
        assert nested.node_id == "1.nested"
        assert nested_2.node_id == "1.nested.nested"
        assert nested_2.node_id == "1.nested.nested"
        assert reference.node_id == "2"
        assert list_node.node_id == "1.list"
        assert item_1.node_id == "1.list.0"

    def test_search(self):
        document_1 = {
            "uid": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {
                "name": "Nested",
                "description": "",
                "type": "blueprint_2",
                "nested": {
                    "name": "Nested",
                    "description": "",
                    "type": "blueprint_3",
                    "reference": {
                        "_id": "2",
                        "uid": "2",
                        "name": "Reference",
                        "description": "",
                        "type": "blueprint_2",
                    },
                },
            },
        }

        root = Node.from_dict(DTO(document_1), blueprint_provider)

        child_1 = root.search("1.nested.nested")

        assert child_1.node_id == "1.nested.nested"

        child_2 = root.search("2")

        assert child_2.node_id == "2"

    def test_get_by_keys(self):
        document_1 = {
            "uid": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {
                "name": "Nested",
                "description": "",
                "type": "blueprint_2",
                "nested": {
                    "name": "Nested",
                    "description": "",
                    "type": "blueprint_3",
                    "reference": {
                        "_id": "2",
                        "uid": "2",
                        "name": "Reference",
                        "description": "",
                        "type": "blueprint_2",
                    },
                },
            },
        }

        root = Node.from_dict(DTO(document_1), blueprint_provider)

        child_1 = root.get_by_path(["nested", "nested"])

        assert child_1.node_id == "1.nested.nested"

        child_2 = root.get_by_path(["nested", "nested", "reference"])

        assert child_2.node_id == "2"

    def test_update(self):
        document_1 = {
            "uid": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {
                "name": "Nested",
                "description": "",
                "type": "blueprint_2",
                "nested": {
                    "name": "Nested",
                    "description": "",
                    "type": "blueprint_3",
                    "reference": {
                        "_id": "2",
                        "uid": "2",
                        "name": "Reference",
                        "description": "",
                        "type": "blueprint_2",
                    },
                },
            },
        }

        root = Node.from_dict(DTO(document_1), blueprint_provider)

        update_0 = {
            "name": "New name",
            "description": "",
            "type": "blueprint_1",
            "nested": {
                "name": "Nested",
                "description": "Some description",
                "type": "blueprint_2",
                "nested": {
                    "name": "Nested",
                    "description": "",
                    "type": "blueprint_3",
                    "reference": {"_id": "2", "name": "Reference", "description": "", "type": "blueprint_2"},
                },
            },
        }

        root.update(update_0)

        assert pretty_eq(update_0, root.to_dict()) is None

        update_1 = {
            "name": "New name",
            "description": "",
            "type": "blueprint_1",
            "nested": {
                "name": "Nested",
                "description": "Some description",
                "type": "blueprint_2",
                "nested": {
                    "name": "New name",
                    "description": "",
                    "type": "blueprint_3",
                    "reference": {"_id": "2", "name": "Reference", "description": "", "type": "blueprint_2"},
                },
            },
        }

        root.update(update_1)

        assert pretty_eq(update_1, root.to_dict()) is None

        update_2 = {
            "name": "New name",
            "description": "",
            "type": "blueprint_1",
            "nested": {
                "name": "Nested",
                "description": "Some description",
                "type": "blueprint_2",
                "nested": {
                    "name": "New name",
                    "description": "",
                    "type": "blueprint_3",
                    "reference": {"_id": "2", "name": "New name", "description": "", "type": "blueprint_2"},
                },
            },
        }

        root.update(update_2)

        assert pretty_eq(update_2, root.to_dict()) is None

        actual = {
            "uid": "1",
            "_id": "1",
            "name": "New name",
            "type": "blueprint_1",
            "description": "",
            "nested": {
                "name": "Nested",
                "type": "blueprint_2",
                "description": "Some description",
                "nested": {
                    "name": "New name",
                    "type": "blueprint_3",
                    "description": "",
                    "reference": {
                        "uid": "2",
                        "_id": "2",
                        "name": "New name",
                        "type": "blueprint_2",
                        "description": "",
                    },
                },
            },
        }

        # reference and nested.nested.reference has uid and id generated since the tree now includes
        # nodes when attributes are missing, needed for having error nodes in the index.

        actual_flat = flatten_dict(actual)
        expected_flat = flatten_dict(root.to_dict())
        # less than only works on flat dictionaries.
        assert actual_flat.items() <= expected_flat.items()

    def test_from_dict(self):
        document_1 = {
            "uid": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {
                "name": "Nested",
                "description": "",
                "type": "blueprint_2",
                "_blueprint": blueprint_2,
                "nested": {
                    "name": "Nested",
                    "description": "",
                    "type": "blueprint_3",
                    "_blueprint": blueprint_3,
                    "reference": {
                        "uid": "5",
                        "name": "Reference",
                        "description": "",
                        "type": "blueprint_2",
                        "_blueprint": blueprint_2,
                    },
                },
            },
            "reference": {
                "uid": "2",
                "name": "Reference",
                "description": "",
                "type": "blueprint_2",
                "_blueprint": blueprint_2,
            },
            "references": [
                {
                    "uid": "3",
                    "name": "Reference 1",
                    "description": "",
                    "type": "blueprint_2",
                    "_blueprint": blueprint_2,
                },
                {
                    "uid": "4",
                    "name": "Reference 2",
                    "description": "",
                    "type": "blueprint_2",
                    "_blueprint": blueprint_2,
                },
            ],
            "_blueprint": blueprint_1,
        }

        root = Node.from_dict(DTO(document_1), blueprint_provider)

        actual = {
            "uid": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {
                "name": "Nested",
                "description": "",
                "type": "blueprint_2",
                "nested": {
                    "name": "Nested",
                    "description": "",
                    "type": "blueprint_3",
                    "reference": {"uid": "5", "name": "Reference", "description": "", "type": "blueprint_2"},
                },
            },
            "reference": {"uid": "2", "name": "Reference", "description": "", "type": "blueprint_2"},
            "references": [
                {"uid": "3", "name": "Reference 1", "description": "", "type": "blueprint_2"},
                {"uid": "4", "name": "Reference 2", "description": "", "type": "blueprint_2"},
            ],
        }

        assert pretty_eq(actual, root.to_dict()) is None

    def test_from_dict_using_dict_importer(self):
        document_1 = {
            "uid": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {
                "name": "Nested",
                "description": "",
                "type": "blueprint_2",
                "_blueprint": blueprint_2,
                "nested": {
                    "name": "Nested",
                    "description": "",
                    "type": "blueprint_3",
                    "_blueprint": blueprint_3,
                    "reference": {
                        "uid": "5",
                        "name": "Reference",
                        "description": "",
                        "type": "blueprint_2",
                        "_blueprint": blueprint_2,
                    },
                },
            },
            "reference": {
                "uid": "2",
                "name": "Reference",
                "description": "",
                "type": "blueprint_2",
                "_blueprint": blueprint_2,
            },
            "references": [
                {
                    "uid": "3",
                    "name": "Reference 1",
                    "description": "",
                    "type": "blueprint_2",
                    "_blueprint": blueprint_2,
                },
                {
                    "uid": "4",
                    "name": "Reference 2",
                    "description": "",
                    "type": "blueprint_2",
                    "_blueprint": blueprint_2,
                },
            ],
            "_blueprint": blueprint_1,
        }

        actual = {
            "uid": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {
                "name": "Nested",
                "description": "",
                "type": "blueprint_2",
                "nested": {
                    "name": "Nested",
                    "description": "",
                    "type": "blueprint_3",
                    "reference": {"uid": "5", "name": "Reference", "description": "", "type": "blueprint_2"},
                },
            },
            "reference": {"uid": "2", "name": "Reference", "description": "", "type": "blueprint_2"},
            "references": [
                {"uid": "3", "name": "Reference 1", "description": "", "type": "blueprint_2"},
                {"uid": "4", "name": "Reference 2", "description": "", "type": "blueprint_2"},
            ],
        }

        root = DictImporter.from_dict(DTO(document_1), blueprint_provider)

        assert pretty_eq(actual, root.to_dict()) is None

    def test_to_dict(self):
        root_data = {"uid": 1, "name": "root", "description": "", "type": "blueprint_1"}
        root = Node(key="root", uid="1", entity=root_data, blueprint_provider=blueprint_provider)

        nested_data = {"name": "Nested", "description": "", "type": "blueprint_2"}
        nested = Node(
            key="nested", uid="", entity=nested_data, blueprint_provider=blueprint_provider, parent=root
        )

        nested_2_data = {"name": "Nested", "description": "", "type": "blueprint_3"}
        nested_2 = Node(
            key="nested", uid="", entity=nested_2_data, blueprint_provider=blueprint_provider, parent=nested
        )

        nested_2_reference_data = {"uid": "2", "name": "Reference", "description": "", "type": "blueprint_2"}
        Node(
            key="reference",
            uid="2",
            entity=nested_2_reference_data,
            blueprint_provider=blueprint_provider,
            parent=nested_2,
        )

        list_data = {"name": "List", "type": "blueprint_3"}
        list_node = ListNode(
            key="list", uid="", entity=list_data, parent=root, blueprint_provider=blueprint_provider
        )

        item_1_data = {"name": "Item 1", "description": "", "type": "blueprint_2"}
        item_1 = Node(
            key="0", uid="", entity=item_1_data, blueprint_provider=blueprint_provider, parent=list_node
        )

        actual_root = {
            "_id": "1",
            "uid": "1",
            "name": "root",
            "description": "",
            "type": "blueprint_1",
            "nested": {
                "name": "Nested",
                "description": "",
                "type": "blueprint_2",
                "nested": {
                    "name": "Nested",
                    "description": "",
                    "type": "blueprint_3",
                    "reference": {
                        "_id": "2",
                        "uid": "2",
                        "name": "Reference",
                        "description": "",
                        "type": "blueprint_2",
                    },
                },
            },
            "list": [{"name": "Item 1", "description": "", "type": "blueprint_2"}],
        }

        assert actual_root == DictExporter.to_dict(root)

        actual_nested = {
            "name": "Nested",
            "description": "",
            "type": "blueprint_2",
            "nested": {
                "name": "Nested",
                "description": "",
                "type": "blueprint_3",
                "reference": {"_id": "2", "uid": "2", "name": "Reference", "description": "", "type": "blueprint_2"},
            },
        }

        assert actual_nested == nested.to_dict()

        item_1_actual = {"name": "Item 1", "description": "", "type": "blueprint_2"}

        assert item_1_actual == item_1.to_dict()

import unittest
from unittest import mock

from core.repository import Repository
from core.service.document_service import DocumentService, get_complete_document
from tests.util_tests import flatten_dict
from utils.data_structure.compare import pretty_eq

from classes.blueprint import Blueprint
from classes.dto import DTO
from classes.tree_node import Node

blueprint_1 = {
    "type": "system/SIMOS/Blueprint",
    "name": "Blueprint 1",
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
    "name": "Blueprint 2",
    "description": "Second blueprint",
    "attributes": [
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "description"},
    ],
    "storageRecipes": [],
    "uiRecipes": [],
}


def get_blueprint(type: str):
    if type == "blueprint_1":
        return Blueprint(DTO(blueprint_1))
    if type == "blueprint_2":
        return Blueprint(DTO(blueprint_2))
    return None


class DocumentServiceTestCase(unittest.TestCase):
    def test_remove_document(self):
        document_repository: Repository = mock.Mock()

        document_1 = {"uid": "1", "name": "Parent", "description": "", "type": "blueprint_1"}

        def mock_get(document_id: str):
            if document_id == "1":
                return DTO(data=document_1.copy())
            return None

        document_repository.get = mock_get

        def repository_provider(data_source_id):
            if data_source_id == "testing":
                return document_repository

        document_service = DocumentService(repository_provider=repository_provider, blueprint_provider=get_blueprint)
        document_service.remove_document(data_source_id="testing", document_id="1", parent_id=None)
        document_repository.delete.assert_called_with("1")

    def test_remove_nested(self):
        document_repository: Repository = mock.Mock()

        document_1 = {
            "uid": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {"name": "Nested", "description": "", "type": "blueprint_2"},
        }

        def mock_get(document_id: str):
            if document_id == "1":
                return DTO(data=document_1.copy())
            return None

        document_repository.get = mock_get

        def repository_provider(data_source_id):
            if data_source_id == "testing":
                return document_repository

        document_service = DocumentService(repository_provider=repository_provider, blueprint_provider=get_blueprint)
        document_service.remove_document(data_source_id="testing", document_id="1.nested", parent_id="1")
        document_repository.update.assert_called_once()

    def test_remove_reference(self):
        document_repository: Repository = mock.Mock()

        document_1 = {
            "uid": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "reference": {"_id": "2", "name": "Reference", "type": "blueprint_2"},
        }
        document_2 = {"uid": "2", "name": "Reference", "description": "", "type": "blueprint_2"}

        def mock_get(document_id: str):
            if document_id == "1":
                return DTO(data=document_1.copy())
            if document_id == "2":
                return DTO(data=document_2.copy())
            return None

        document_repository.get = mock_get

        def repository_provider(data_source_id):
            if data_source_id == "testing":
                return document_repository

        document_service = DocumentService(repository_provider=repository_provider, blueprint_provider=get_blueprint)
        document_service.remove_document(data_source_id="testing", document_id="2", parent_id="1")
        document_repository.update.assert_called_once()
        document_repository.delete.assert_called_with("2")

    def test_rename_attribute(self):
        document_repository: Repository = mock.Mock()

        document_1 = {
            "uid": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {"name": "Nested", "description": "", "type": "blueprint_2"},
        }

        def mock_get(document_id: str):
            if document_id == "1":
                return DTO(data=document_1.copy())
            return None

        document_repository.get = mock_get

        def repository_provider(data_source_id):
            if data_source_id == "testing":
                return document_repository

        document_service = DocumentService(repository_provider=repository_provider, blueprint_provider=get_blueprint)
        document = document_service.rename_attribute(
            data_source_id="testing", parent_id="1", attribute="nested", name="New name"
        )

        assert isinstance(document.data, dict)

        actual = {"uid": "1", "nested": {"name": "New name", "description": "", "type": "blueprint_2"}}

        assert pretty_eq(actual, document.data) is None

    def test_save_update(self):
        repository: Repository = mock.Mock()

        doc_storage = {
            "1": {
                "uid": "1",
                "name": "Parent",
                "description": "",
                "type": "blueprint_1",
                "nested": {"name": "Nested", "description": "", "type": "blueprint_2"},
                "reference": {"_id": "2", "name": "a_reference", "type": "blueprint_2"},
                "references": [
                    {"_id": "3", "name": "ref1", "type": "blueprint_2"},
                    {"_id": "4", "name": "ref2", "type": "blueprint_2"},
                ],
            },
            "2": {"uid": "2", "_id": "2", "name": "a_reference", "description": "", "type": "blueprint_2"},
            "3": {"uid": "3", "_id": "3", "name": "ref1", "description": "", "type": "blueprint_2"},
            "4": {"uid": "4", "_id": "4", "name": "ref2", "description": "TEST", "type": "blueprint_2"},
        }

        doc_1_after = {
            "_id": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {"name": "Nested", "description": "", "type": "blueprint_2"},
            "reference": {"_id": "2", "name": "a_reference", "type": "blueprint_2"},
            "references": [
                {"_id": "3", "name": "ref1", "type": "blueprint_2"},
                {"_id": "4", "name": "ref2", "type": "blueprint_2"},
            ],
        }

        doc_4_after = {"_id": "4", "name": "ref2", "description": "TEST_MODIFY", "type": "blueprint_2"}

        def mock_get(document_id: str):
            return DTO(doc_storage[document_id])

        def mock_update(dto: DTO):
            doc_storage[dto.uid] = dto.data
            return None

        def repository_provider(data_source_id):
            if data_source_id == "testing":
                return repository

        repository.get = mock_get
        repository.update = mock_update
        document_service = DocumentService(blueprint_provider=get_blueprint, repository_provider=repository_provider)

        node: Node = document_service.get_by_uid("testing", "1")
        contained_node: Node = node.search("4")
        contained_node.update({"description": "TEST_MODIFY"})
        document_service.save(node, "testing")

        assert doc_1_after == doc_storage["1"]
        assert doc_4_after == doc_storage["4"]

    def test_save_append(self):
        repository: Repository = mock.Mock()

        doc_storage = {
            "1": {"uid": "1", "name": "Parent", "description": "", "type": "blueprint_1", "references": []},
            "2": {"uid": "2", "_id": "2", "name": "a_reference", "description": "", "type": "blueprint_2"},
        }

        document_1_after = {
            "_id": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {},
            "reference": {},
            "references": [{"name": "a_reference", "type": "blueprint_2", "_id": "2"}],
        }

        def mock_get(document_id: str):
            return DTO(doc_storage[document_id])

        def mock_update(dto: DTO):
            doc_storage[dto.uid] = dto.data
            return None

        repository.get = mock_get
        repository.update = mock_update

        def repository_provider(data_source_id):
            if data_source_id == "testing":
                return repository

        document_service = DocumentService(blueprint_provider=get_blueprint, repository_provider=repository_provider)

        node: Node = document_service.get_by_uid("testing", "1")
        contained_node: Node = node.search("1.references")
        contained_node.children.append(Node("0", DTO(doc_storage["2"]), contained_node.blueprint))
        document_service.save(node, "testing")
        assert document_1_after == doc_storage["1"]

    def test_save_delete(self):
        repository: Repository = mock.Mock()

        doc_storage = {
            "1": {
                "_id": "1",
                "uid": "1",
                "name": "Parent",
                "description": "",
                "type": "blueprint_1",
                "references": [
                    {"_id": "2", "name": "a_reference", "type": "blueprint_2"},
                    {"_id": "3", "name": "a_reference", "type": "blueprint_2"},
                    {"_id": "4", "name": "a_reference", "type": "blueprint_2"},
                ],
            },
            "2": {"uid": "2", "_id": "2", "name": "a_reference", "description": "Index 1", "type": "blueprint_2"},
            "3": {"uid": "3", "_id": "3", "name": "a_reference", "description": "Index 2", "type": "blueprint_2"},
            "4": {"uid": "4", "_id": "4", "name": "a_reference", "description": "Index 3", "type": "blueprint_2"},
        }

        doc_1_after = {
            "name": "Parent",
            "_id": "1",
            "description": "",
            "type": "blueprint_1",
            "nested": {},
            "reference": {},
            "references": [
                {"_id": "2", "name": "a_reference", "type": "blueprint_2"},
                {"_id": "4", "name": "a_reference", "type": "blueprint_2"},
            ],
        }

        def mock_get(document_id: str):
            return DTO(doc_storage[document_id])

        def mock_update(dto: DTO):
            doc_storage[dto.uid] = dto.data
            return None

        repository.get = mock_get
        repository.update = mock_update

        def repository_provider(data_source_id):
            if data_source_id == "testing":
                return repository

        document_service = DocumentService(blueprint_provider=get_blueprint, repository_provider=repository_provider)

        node: Node = document_service.get_by_uid("testing", "1")
        contained_node: Node = node.search("1.references")
        contained_node.remove_by_path(["1"])
        document_service.save(node, "testing")


        assert flatten_dict(doc_1_after).items() <= flatten_dict(doc_storage["1"]).items()
        assert doc_storage["3"] is not None

    def test_get_complete_document(self):
        document_1 = {
            "uid": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {"name": "Nested", "description": "", "type": "blueprint_2"},
            "reference": {"_id": "2", "name": "Reference", "type": "blueprint_2"},
            "references": [
                {"_id": "3", "name": "Reference 1", "type": "blueprint_2"},
                {"_id": "4", "name": "Reference 2", "type": "blueprint_2"},
            ],
        }

        document_2 = {"uid": "2", "name": "Reference", "description": "", "type": "blueprint_2"}
        document_3 = {"uid": "3", "name": "Reference 1", "description": "", "type": "blueprint_2"}
        document_4 = {"uid": "4", "name": "Reference 2", "description": "", "type": "blueprint_2"}

        document_repository: Repository = mock.Mock()

        def mock_get(document_id: str):
            if document_id == "1":
                return DTO(data=document_1.copy())
            if document_id == "2":
                return DTO(data=document_2.copy())
            if document_id == "3":
                return DTO(data=document_3.copy())
            if document_id == "4":
                return DTO(data=document_4.copy())
            return None

        document_repository.get = mock_get

        root = get_complete_document(
            document_uid="1", document_repository=document_repository, blueprint_provider=get_blueprint
        )

        assert isinstance(root, dict)

        actual = {
            "uid": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {"name": "Nested", "description": "", "type": "blueprint_2"},
            "reference": document_2,
            "references": [document_3, document_4],
        }

        assert pretty_eq(actual, root) is None

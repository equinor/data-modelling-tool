import unittest
from unittest import mock

from classes.blueprint_attribute import BlueprintAttribute
from classes.dto import DTO
from classes.tree_node import Node
from core.repository import Repository
from core.service.document_service import DocumentService, get_complete_document
from tests.core.document_service.common import blueprint_provider
from tests.util_tests import flatten_dict
from utils.data_structure.compare import pretty_eq


class DocumentServiceTestCase(unittest.TestCase):
    def test_save_update(self):
        repository: Repository = mock.Mock()

        doc_storage = {
            "1": {
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
            },
            "2": {"_id": "2", "name": "a_reference", "description": "", "type": "blueprint_2"},
            "3": {"_id": "3", "name": "ref1", "description": "", "type": "blueprint_2"},
            "4": {"_id": "4", "name": "ref2", "description": "TEST", "type": "blueprint_2"},
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
        document_service = DocumentService(
            blueprint_provider=blueprint_provider, repository_provider=repository_provider
        )

        node: Node = document_service.get_by_uid("testing", "1")
        contained_node: Node = node.search("4")
        contained_node.update(doc_4_after.copy())
        document_service.save(node, "testing")

        assert doc_1_after == doc_storage["1"]
        assert doc_4_after == doc_storage["4"]

    def test_save_append(self):
        repository: Repository = mock.Mock()

        doc_storage = {
            "1": {"_id": "1", "name": "Parent", "description": "", "type": "blueprint_1", "references": []},
            "2": {"_id": "2", "name": "a_reference", "description": "", "type": "blueprint_2"},
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

        document_service = DocumentService(
            blueprint_provider=blueprint_provider, repository_provider=repository_provider
        )

        node: Node = document_service.get_by_uid("testing", "1")
        contained_node: Node = node.search("1.references")
        contained_node.children.append(
            Node(
                "0",
                uid="2",
                entity=doc_storage["2"],
                blueprint_provider=blueprint_provider,
                attribute=BlueprintAttribute("references", "blueprint_2"),
            )
        )
        document_service.save(node, "testing")

        # assert document_1_after == doc_storage["1"]
        assert flatten_dict(document_1_after).items() == flatten_dict(doc_storage["1"]).items()

    def test_save_delete(self):
        repository: Repository = mock.Mock()

        doc_storage = {
            "1": {
                "_id": "1",
                "name": "Parent",
                "description": "",
                "type": "blueprint_1",
                "references": [
                    {"_id": "2", "name": "a_reference", "type": "blueprint_2"},
                    {"_id": "3", "name": "a_reference", "type": "blueprint_2"},
                    {"_id": "4", "name": "a_reference", "type": "blueprint_2"},
                ],
            },
            "2": {"_id": "2", "name": "a_reference", "description": "Index 1", "type": "blueprint_2"},
            "3": {"_id": "3", "name": "a_reference", "description": "Index 2", "type": "blueprint_2"},
            "4": {"_id": "4", "name": "a_reference", "description": "Index 3", "type": "blueprint_2"},
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

        document_service = DocumentService(
            blueprint_provider=blueprint_provider, repository_provider=repository_provider
        )

        node: Node = document_service.get_by_uid("testing", "1")
        contained_node: Node = node.search("1.references")
        contained_node.remove_by_path(["1"])
        document_service.save(node, "testing")

        assert flatten_dict(doc_1_after).items() <= flatten_dict(doc_storage["1"]).items()
        assert doc_storage["3"] is not None

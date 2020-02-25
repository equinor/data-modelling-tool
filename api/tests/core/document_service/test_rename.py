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
    def test_rename_attribute(self):
        document_repository: Repository = mock.Mock()

        doc_storage = {
            "1": {
                "_id": "1",
                "name": "Parent",
                "description": "",
                "type": "blueprint_1",
                "nested": {"name": "Nested", "description": "", "type": "blueprint_2"},
            }
        }

        def mock_get(document_id: str):
            if document_id == "1":
                return DTO(data=doc_storage["1"])
            return None

        def mock_update(dto: DTO):
            doc_storage[dto.uid] = dto.data

        document_repository.get = mock_get
        document_repository.update = mock_update

        def repository_provider(data_source_id):
            if data_source_id == "testing":
                return document_repository

        document_service = DocumentService(
            repository_provider=repository_provider, blueprint_provider=blueprint_provider
        )
        document_service.rename_document(
            data_source_id="testing", parent_uid="1", document_id="1.nested", name="New name"
        )

        actual = {"name": "New name", "description": "", "type": "blueprint_2"}

        assert pretty_eq(actual, doc_storage["1"]["nested"]) is None

    def test_rename_root_package(self):
        document_repository: Repository = mock.Mock()

        doc_storage = {
            "1": {
                "_id": "1",
                "name": "RootPackage",
                "description": "My root package",
                "type": "blueprint_1",
                "content": [],
            }
        }

        def mock_get(document_id: str):
            if document_id == "1":
                return DTO(data=doc_storage["1"].copy())
            return None

        def mock_update(dto: DTO):
            doc_storage[dto.uid] = dto.data

        document_repository.get = mock_get
        document_repository.update = mock_update

        def repository_provider(data_source_id):
            if data_source_id == "testing":
                return document_repository

        document_service = DocumentService(
            repository_provider=repository_provider, blueprint_provider=blueprint_provider
        )
        document_service.rename_document(data_source_id="testing", document_id="1", name="New name")

        actual = {"_id": "1", "name": "New name"}

        assert pretty_eq(actual, doc_storage["1"]) is None

    def test_rename_single_reference(self):
        document_repository: Repository = mock.Mock()

        doc_storage = {
            "1": {
                "_id": "1",
                "name": "Parent",
                "description": "",
                "type": "blueprint_1",
                "reference": {"_id": "2", "name": "Reference", "type": "blueprint_2"},
            },
            "2": {"_id": "2", "name": "Reference", "description": "", "type": "blueprint_2"},
        }

        def mock_get(document_id: str):
            return DTO(doc_storage[document_id])

        def mock_update(dto: DTO):
            doc_storage[dto.uid] = dto.data

        document_repository.get = mock_get
        document_repository.update = mock_update

        def repository_provider(data_source_id):
            if data_source_id == "testing":
                return document_repository

        document_service = DocumentService(
            repository_provider=repository_provider, blueprint_provider=blueprint_provider
        )
        document_service.rename_document(data_source_id="testing", document_id="2", parent_uid="1", name="New name")

        actual = {"_id": "1", "reference": {"_id": "2", "name": "New name", "type": "blueprint_2"}}
        actual2 = {"_id": "2", "name": "New name", "type": "blueprint_2"}

        assert pretty_eq(actual, doc_storage["1"]) is None
        assert pretty_eq(actual2, doc_storage["2"]) is None

    def test_rename_reference_list(self):
        document_repository: Repository = mock.Mock()

        doc_storage = {
            "1": {
                "_id": "1",
                "name": "Parent",
                "description": "",
                "type": "blueprint_1",
                "references": [{"_id": "2", "name": "Reference", "type": "blueprint_2"}],
            },
            "2": {"_id": "2", "name": "Reference", "description": "", "type": "blueprint_2"},
        }

        def mock_get(document_id: str):
            return DTO(doc_storage[document_id])

        def mock_update(dto: DTO):
            doc_storage[dto.uid] = dto.data

        document_repository.get = mock_get
        document_repository.update = mock_update

        def repository_provider(data_source_id):
            if data_source_id == "testing":
                return document_repository

        document_service = DocumentService(
            repository_provider=repository_provider, blueprint_provider=blueprint_provider
        )
        document_service.rename_document(data_source_id="testing", document_id="2", parent_uid="1", name="New name")

        actual = {"_id": "1", "references": [{"_id": "2", "name": "New name", "type": "blueprint_2"}]}
        actual2 = {"_id": "2", "name": "New name", "type": "blueprint_2"}

        assert pretty_eq(actual, doc_storage["1"]) is None
        assert pretty_eq(actual2, doc_storage["2"]) is None

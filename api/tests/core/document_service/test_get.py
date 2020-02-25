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
    def test_get_complete_document(self):
        document_1 = {
            "_id": "1",
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

        document_2 = {"_id": "2", "name": "Reference", "description": "", "type": "blueprint_2"}
        document_3 = {"_id": "3", "name": "Reference 1", "description": "", "type": "blueprint_2"}
        document_4 = {"_id": "4", "name": "Reference 2", "description": "", "type": "blueprint_2"}

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
            document_uid="1", document_repository=document_repository, blueprint_provider=blueprint_provider
        )

        assert isinstance(root, dict)

        actual = {
            "_id": "1",
            "name": "Parent",
            "description": "",
            "type": "blueprint_1",
            "nested": {"name": "Nested", "description": "", "type": "blueprint_2"},
            "reference": document_2,
            "references": [document_3, document_4],
        }

        assert pretty_eq(actual, root) is None

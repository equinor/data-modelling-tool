import pytest
from unittest import mock
from core.repository.mongo.document_repository import MongoDocumentRepository


@pytest.fixture
def document_dict():
    return {"uid": "1", "filename": "", "path": "path", "type": "type", "templateRef": "", "formData": {}}


def test_repository(document_dict):
    db = mock.Mock()
    db.get.return_value = document_dict
    repo = MongoDocumentRepository(db)
    assert repo.get("document").to_dict() == document_dict

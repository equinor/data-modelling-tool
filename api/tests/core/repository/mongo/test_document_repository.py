import pytest
from unittest import mock
from core.repository.mongo.document_repository import DocumentRepository


@pytest.fixture
def document_dict():
    return {"meta": {"documentType": "file", "templateRef": ""}, "formData": {}}


def test_repository(document_dict):
    db = mock.Mock()
    db.client.read_form.return_value = document_dict
    repo = DocumentRepository(db)
    assert repo.get_by_id("document").to_dict() == document_dict

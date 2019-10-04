import pytest
from unittest import mock, skip


@pytest.fixture
def document_dict():
    return {"uid": "1", "filename": "", "path": "path", "type": "type", "templateRef": "", "formData": {}}


@skip("not working")
def test_repository(document_dict):
    db = mock.Mock()
    db.get.return_value = document_dict
    # repo = MongoDocumentRepository(db)
    # assert repo.get("document").to_dict() == document_dict

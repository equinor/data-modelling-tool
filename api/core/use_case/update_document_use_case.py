from typing import Dict

from core.repository.repository_factory import get_repository
from core.service.document_service import DocumentService
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc


class UpdateDocumentRequestObject(req.ValidRequestObject):
    def __init__(self, data_source_id=None, document_id=None, data=None, attribute=None):
        self.data_source_id = data_source_id
        self.data = data
        self.document_id = document_id
        self.attribute = attribute

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "data_source_id" not in adict:
            invalid_req.add_error("data_source_id", "is missing")

        if "document_id" not in adict:
            invalid_req.add_error("document_id", "is missing")

        if "data" not in adict:
            invalid_req.add_error("data", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(
            data_source_id=adict.get("data_source_id"),
            data=adict.get("data"),
            document_id=adict.get("document_id"),
            attribute=adict.get("attribute"),
        )


class UpdateDocumentUseCase(uc.UseCase):
    def __init__(self, repository_provider=get_repository):
        self.repository_provider = repository_provider

    def process_request(self, request_object: UpdateDocumentRequestObject):
        data_source_id = request_object.data_source_id
        document_id: str = request_object.document_id
        data: Dict = request_object.data
        attribute_path: str = request_object.attribute

        document_service = DocumentService(repository_provider=self.repository_provider)
        document = document_service.update_document(
            data_source_id=data_source_id, document_id=document_id, data=data, attribute_path=attribute_path
        )
        document_service.invalidate_cache()
        return res.ResponseSuccess(document)

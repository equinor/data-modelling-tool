from typing import Dict

from core.repository import Repository
from core.service.document_service import DocumentService
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc


class UpdateDocumentRequestObject(req.ValidRequestObject):
    def __init__(self, document_id=None, data=None, attribute=None):
        self.data = data
        self.document_id = document_id
        self.attribute = attribute

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "document_id" not in adict:
            invalid_req.add_error("document_id", "is missing")

        if "data" not in adict:
            invalid_req.add_error("data", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(data=adict.get("data"), document_id=adict.get("document_id"), attribute=adict.get("attribute"))


class UpdateDocumentUseCase(uc.UseCase):
    def __init__(self, document_repository: Repository):
        self.document_repository = document_repository

    def process_request(self, request_object: UpdateDocumentRequestObject):
        document_id: str = request_object.document_id
        data: Dict = request_object.data
        attribute: Dict = request_object.attribute

        document_service = DocumentService(document_repository=self.document_repository)
        document = document_service.update_document(document_id=document_id, data=data, attribute=attribute)

        return res.ResponseSuccess(document)

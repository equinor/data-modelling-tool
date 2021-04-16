# flake8: noqa: F401

from services.document_service import DocumentService
from restful import request_object as req
from restful import response_object as res
from restful import use_case as uc


class ExportRequestObject(req.ValidRequestObject):
    def __init__(self, document_id=None):
        self.document_id = document_id

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "documentId" not in adict:
            invalid_req.add_error("documentId", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(document_id=adict.get("documentId"))


class ExportUseCase(uc.UseCase):
    def __init__(self, data_source_id):
        self.document_service = DocumentService()
        self.data_source_id = data_source_id

    def process_request(self, request_object: ExportRequestObject):
        document_id: str = request_object.document_id
        memory_file = self.document_service.create_zip_export(self.data_source_id, document_id)
        return res.ResponseSuccess(memory_file)

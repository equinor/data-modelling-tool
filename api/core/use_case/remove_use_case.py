from core.repository import Repository
from core.service.document_service import DocumentService
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc


class RemoveFileRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, document_id=None):
        self.parent_id = parent_id
        self.document_id = document_id

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "documentId" not in adict:
            invalid_req.add_error("documentId", "is missing")

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(parent_id=adict.get("parentId"), document_id=adict.get("documentId"))


class RemoveUseCase(uc.UseCase):
    def __init__(self, document_repository: Repository):
        self.repository = document_repository

    def process_request(self, request_object):
        document_id: str = request_object.document_id
        split_parent_id: str = request_object.parent_id.split(".") if request_object.parent_id else None
        parent_id = None
        if split_parent_id:
            parent_id = split_parent_id[0]

        document_service = DocumentService()
        document_service.remove_document(document_id, self.repository, parent_id)

        return res.ResponseSuccess(True)

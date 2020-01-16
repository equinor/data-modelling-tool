from core.repository import Repository
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.service.document_service import DocumentService


class RemoveFileRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, document_id=None, attribute=None):
        self.parent_id = parent_id
        self.document_id = document_id
        self.attribute = attribute

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "documentId" not in adict:
            invalid_req.add_error("documentId", "is missing")

        if "attribute" not in adict:
            invalid_req.add_error("attribute", "is missing")

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(
            parent_id=adict.get("parentId"), document_id=adict.get("documentId"), attribute=adict.get("attribute")
        )


class RemoveFileUseCase(uc.UseCase):
    def __init__(self, document_repository: Repository):
        self.document_repository = document_repository

    def process_request(self, request_object):
        document_id: str = request_object.document_id
        parent_id: str = request_object.parent_id
        attribute: str = request_object.attribute

        document_service = DocumentService()
        document_service.remove_document(
            document_id=document_id,
            parent_id=parent_id,
            attribute=attribute,
            document_repository=self.document_repository,
        )

        return res.ResponseSuccess(True)

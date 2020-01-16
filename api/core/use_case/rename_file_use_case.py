from core.repository import Repository
from core.service.document_service import DocumentService
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc


class RenameFileRequestObject(req.ValidRequestObject):
    def __init__(self, document_id=None, name=None, parent_id=None, attribute=None):
        self.document_id = document_id
        self.name = name
        self.parent_id = parent_id
        self.attribute = attribute

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if "documentId" not in adict:
            invalid_req.add_error("documentId", "is missing")

        if "name" not in adict:
            invalid_req.add_error("name", "is missing")

        if "attribute" not in adict:
            invalid_req.add_error("attribute", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(
            document_id=adict.get("documentId"),
            name=adict.get("name"),
            parent_id=adict.get("parentId"),
            attribute=adict.get("attribute"),
        )


class RenameFileUseCase(uc.UseCase):
    def __init__(self, document_repository: Repository):
        self.document_repository = document_repository

    def process_request(self, request_object: RenameFileRequestObject):
        document_id = request_object.document_id
        name = request_object.name
        parent_id = request_object.parent_id
        attribute = request_object.attribute

        document_service = DocumentService()
        document = document_service.rename_document(
            document_id=document_id,
            parent_id=parent_id,
            name=name,
            attribute=attribute,
            document_repository=self.document_repository,
        )

        return res.ResponseSuccess(document)

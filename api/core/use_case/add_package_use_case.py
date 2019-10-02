from uuid import uuid4

from core.domain.document import Document
from core.repository.interface.document_repository import DocumentRepository
from utils.logging import logger
from core.shared import response_object as res
from core.shared import request_object as req
from core.shared import use_case as uc


class AddPackageRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, filename=None, type=None):
        self.parent_id = parent_id
        self.filename = filename
        self.type = type

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if "filename" not in adict:
            invalid_req.add_error("filename", "is missing")

        if "type" not in adict:
            invalid_req.add_error("type", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(parent_id=adict.get("parentId"), filename=adict.get("filename"), type=adict.get("type"))


class AddPackageUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object):
        parent_id: str = request_object.parent_id
        filename: str = request_object.filename
        type: str = request_object.type

        parent: Document = self.document_repository.get(parent_id)
        if not parent:
            raise Exception(f"The parent, with id {parent_id}, was not found")

        path = str(parent.path) if str(parent.path) != "/" else ""
        folder = Document(
            uid=str(uuid4()), filename=filename, type="folder", path=f"{path}/{parent.filename}", template_ref=type
        )

        self.document_repository.add(folder)

        logger.info(f"Added folder '{folder.uid}' to package '{folder.path}'")
        return res.ResponseSuccess(folder)

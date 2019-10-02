from uuid import uuid4

from core.domain.document import Document
from core.repository.interface.document_repository import DocumentRepository
from utils.logging import logger
from core.shared import response_object as res
from core.shared import request_object as req
from core.shared import use_case as uc


class AddRootPackageRequestObject(req.ValidRequestObject):
    def __init__(self, filename=None, type=None):
        self.filename = filename
        self.type = type

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "filename" not in adict:
            invalid_req.add_error("filename", "is missing")

        if "type" not in adict:
            invalid_req.add_error("type", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(filename=adict.get("filename"), type=adict.get("type"))


class AddRootPackageUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object):
        filename: str = request_object.filename
        type: str = request_object.type

        folder = Document(uid=str(uuid4()), filename=filename, type="folder", path=f"/", template_ref=type)

        self.document_repository.add(folder)

        logger.info(f"Added folder '{folder.uid}' to package '{folder.path}'")
        return res.ResponseSuccess(folder)

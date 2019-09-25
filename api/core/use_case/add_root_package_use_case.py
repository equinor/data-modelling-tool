from uuid import uuid4

from core.domain.document import Document
from core.repository.interface.document_repository import DocumentRepository
from utils.logging import logger
from core.shared import response_object as res
from core.shared import request_object as req
from core.shared import use_case as uc


class AddRootPackageRequestObject(req.ValidRequestObject):
    def __init__(self, filename=None, template_ref=None):
        self.filename = filename
        self.template_ref = template_ref

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "filename" not in adict:
            invalid_req.add_error("filename", "is missing")

        if "templateRef" not in adict:
            invalid_req.add_error("templateRef", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(filename=adict.get("filename"), template_ref=adict.get("templateRef"))


class AddRootPackageUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object):
        filename: str = request_object.filename
        template_ref: str = request_object.template_ref

        folder = Document(uid=str(uuid4()), filename=filename, type="folder", path=f"/", template_ref=template_ref)

        self.document_repository.add(folder)

        logger.info(f"Added folder '{folder.uid}' to package '{folder.path}'")
        return res.ResponseSuccess(folder)

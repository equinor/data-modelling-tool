from uuid import uuid4

from core.domain.document import Document
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.repository.interface.document_repository import DocumentRepository


class AddFileRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, filename=None, template_ref=None):
        self.parent_id = parent_id
        self.filename = filename
        self.template_ref = template_ref

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if "filename" not in adict:
            invalid_req.add_error("filename", "is missing")

        if "templateRef" not in adict:
            invalid_req.add_error("templateRef", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(
            parent_id=adict.get("parentId"), filename=adict.get("filename"), template_ref=adict.get("templateRef")
        )


class AddFileUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object):
        parent_id: str = request_object.parent_id
        filename: str = request_object.filename
        template_ref: str = request_object.template_ref

        parent: Document = self.document_repository.get(parent_id)
        if not parent:
            raise Exception(f"The parent, with id {parent_id}, was not found")

        path = str(parent.path) if str(parent.path) != "/" else ""
        file = Document(
            uid=str(uuid4()),
            filename=filename,
            type="file",
            path=f"{path}/{parent.filename}",
            template_ref=template_ref,
        )

        self.document_repository.add(file)

        logger.info(f"Added document '{file.uid}' to path '{file.path}'")
        return res.ResponseSuccess(file)

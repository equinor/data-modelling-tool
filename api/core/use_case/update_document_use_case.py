from typing import Dict

from core.domain.dto import DTO
from core.repository.mongo.document_repository import DocumentRepository
from dotted.collection import DottedDict
from core.repository.repository_exceptions import EntityNotFoundException
from utils.logging import logger
from core.shared import response_object as res
from core.shared import request_object as req
from core.shared import use_case as uc


class UpdateDocumentRequestObject(req.ValidRequestObject):
    def __init__(self, document_id=None, data=None, attribute=None):
        self.data = data
        self.document_id = document_id
        self.attribute = attribute

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "data" not in adict:
            invalid_req.add_error("data", "is missing")
        else:
            data = adict["data"]
            if "name" not in data:
                invalid_req.add_error("name", "is missing")

            if "type" not in data:
                invalid_req.add_error("type", "is missing")

            if invalid_req.has_errors():
                return invalid_req

        if "document_id" not in adict:
            invalid_req.add_error("document_id", "is missing")

        return cls(data=adict.get("data"), document_id=adict.get("document_id"), attribute=adict.get("attribute"))


class UpdateDocumentUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object: UpdateDocumentRequestObject):
        document_id: str = request_object.document_id
        data: Dict = request_object.data
        attribute: Dict = request_object.attribute

        document: DTO = self.document_repository.get(document_id)

        if not document:
            raise EntityNotFoundException(uid=document_id)

        existing_data = document.data
        if attribute:
            obj = DottedDict(existing_data)
            obj[attribute] = data
            document.data = obj.to_python()

        else:
            document.data = data

        self.document_repository.update(document)

        logger.info(f"Updated document '{document.uid}''")

        return res.ResponseSuccess(document)

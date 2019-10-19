from core.domain.dto import DTO
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.repository.interface.document_repository import DocumentRepository


class RemoveFileRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, name=None, attribute=None):
        self.parent_id = parent_id
        self.name = name
        self.attribute = attribute

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "name" not in adict:
            invalid_req.add_error("name", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(parent_id=adict.get("parentId"), name=adict.get("name"), attribute=adict.get("attribute", ""))


class RemoveFileUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object):
        name: str = request_object.name
        parent_id: str = request_object.parent_id
        attribute: str = request_object.attribute

        parent: DTO = self.document_repository.get(parent_id)
        if not parent:
            raise Exception(f"The parent, with id {parent_id}, was not found")

        data = parent.data

        # Find reference in parent
        reference = list(filter(lambda d: d["name"] == name, data[attribute]))

        # Remove reference from parent
        data[attribute] = list(filter(lambda d: d["name"] != name, data[attribute]))
        self.document_repository.update(parent)

        # Remove actual document
        document: DTO = self.document_repository.get(reference[0]["_id"])
        self.document_repository.delete(document)

        # TODO: What about children of document?

        logger.info(f"Removed document '{reference}'")
        return res.ResponseSuccess(True)

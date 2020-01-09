from classes.dto import DTO
from core.repository import Repository
from core.repository.repository_exceptions import EntityNotFoundException
from core.service.document_service import DocumentService
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc


class RemoveAttributeRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, attribute=None):
        self.parent_id = parent_id
        self.attribute = attribute

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "attribute" not in adict:
            invalid_req.add_error("attribute", "is missing")

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(parent_id=adict.get("parentId"), attribute=adict.get("attribute"))


class RemoveAttributeUseCase(uc.UseCase):
    def __init__(self, document_repository: Repository):
        self.document_repository = document_repository

    def process_request(self, request_object):
        parent_id: str = request_object.parent_id
        attribute: str = request_object.attribute

        parent: DTO = self.document_repository.get(parent_id)
        if not parent:
            raise EntityNotFoundException(uid=parent_id)

        document_service = DocumentService()
        document_service.remove_attribute(parent, attribute, self.document_repository)
        return res.ResponseSuccess(True)

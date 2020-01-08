from classes.dto import DTO
from core.repository import Repository
from core.repository.repository_exceptions import EntityNotFoundException
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.use_case.utils.get_document_children import get_document_children
from utils.data_structure.find import get
from utils.logging import logger


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

        document: DTO = self.document_repository.get(document_id)
        if not document:
            raise EntityNotFoundException(uid=document_id)

        if parent_id:
            # Remove reference from parent
            parent: DTO = self.document_repository.get(parent_id)
            if not parent:
                raise EntityNotFoundException(uid=parent_id)

            parent[attribute] = list(filter(lambda d: d["_id"] != document.uid, parent[attribute]))

            self.document_repository.update(parent)

        # Remove the actual document
        self.document_repository.delete(document.uid)

        # Remove children of the document
        children = get_document_children(document, self.document_repository)
        for child in children:
            self.document_repository.delete(child.uid)
            logger.info(f"Removed child document '{child.uid}'")

        logger.info(f"Removed document '{document.uid}'")
        return res.ResponseSuccess(True)

from core.domain.dto import DTO
from core.enums import SIMOS
from core.repository.interface.document_repository import DocumentRepository
from core.repository.repository_exceptions import EntityAlreadyExistsException, EntityNotFoundException
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.use_case.utils.get_reference import get_ref_id
from utils.logging import logger


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
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object: RenameFileRequestObject):
        document_id = request_object.document_id
        name = request_object.name
        parent_id = request_object.parent_id
        attribute = request_object.attribute

        document: DTO = self.document_repository.get(document_id)
        if not document:
            raise EntityNotFoundException(document_id)

        if parent_id:
            parent_document = self.document_repository.get(parent_id)
            if not parent_document:
                raise EntityNotFoundException(parent_id)

            references = list(filter(lambda x: x["name"] == name, parent_document.data[attribute]))
            if len(references) > 0:
                raise EntityAlreadyExistsException(name)

            # Remove old reference
            parent_document.data[attribute] = [
                ref for ref in parent_document.data["content"] if not get_ref_id(ref) == document.uid
            ]
            # Add new reference
            reference = {"_id": document.uid, "name": name, "type": document.type}
            parent_document.data[attribute].append(reference)

        if document.type == SIMOS.BLUEPRINT.value:
            document.data.name = name
        else:
            document.data["name"] = name

        self.document_repository.update(document)
        logger.info(f"Rename document '{document.uid}' to '{name}")

        return res.ResponseSuccess(document)

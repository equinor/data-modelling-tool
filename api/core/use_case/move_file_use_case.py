from pathlib import Path

from classes.data_source import DataSource
from core.domain.dto import DTO
from core.repository.interface.document_repository import DocumentRepository
from core.repository.repository_exceptions import EntityAlreadyExistsException, EntityNotFoundException
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.use_case.utils.get_reference import get_ref_id
from core.utility import get_document_by_ref
from utils.logging import logger


class MoveFileRequestObject(req.ValidRequestObject):
    def __init__(self, source=None, destination=None):
        self.source = source
        self.destination = destination

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "source" not in adict:
            invalid_req.add_error("source", "is missing")

        if "destination" not in adict:
            invalid_req.add_error("destination", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(source=adict.get("source"), destination=adict.get("destination"))


class MoveFileUseCase(uc.UseCase):
    def __init__(self, get_repository):
        self.get_repository = get_repository

    def process_request(self, request_object: MoveFileRequestObject):
        source_data_source_id, source = request_object.source.split("/", 1)
        destination_data_source_uid, destination = request_object.destination.split("/", 1)
        source: Path = Path(request_object.source)
        destination: Path = Path(request_object.destination)

        # Check if the new destination package exists
        # TODO: Replace with :=
        different_parent = source.parent != destination.parent
        if different_parent:
            new_parent_document = get_document_by_ref(f"{destination_data_source_uid}/{str(destination.parent)}")
            if not new_parent_document:
                raise EntityNotFoundException(request_object.destination)

        # Check if document already exists in destination
        if get_document_by_ref(request_object.destination):
            raise EntityAlreadyExistsException(request_object.destination)

        # Remove source document
        source_data_source = DataSource(id=source_data_source_id)
        source_document_repository: DocumentRepository = self.get_repository(source_data_source)
        source_document: DTO = get_document_by_ref(request_object.source)
        if not source_document:
            raise EntityNotFoundException(uid=f"{str(source)}")
        source_document_repository.delete(source_document)
        logger.info(f"Removed document '{source_document.uid}' from data source '{source_data_source_id}'")

        # Add destination
        destination_data_source = DataSource(id=destination_data_source_uid)
        destination_document_repository: DocumentRepository = self.get_repository(destination_data_source)
        data = source_document.data
        data.name = destination.name
        destination_document = DTO(uid=source_document.uid, data=data)
        destination_document_repository.add(destination_document)
        logger.info(f"Added document '{destination_document.uid}' to data source '{destination_data_source_uid}")

        # Update parent(s)
        old_parent_document = get_document_by_ref(str(source.parent))
        reference = {"_id": source_document.uid, "name": destination.name, "type": source_document.type}
        # Remove old reference from parent
        old_parent_document.data["content"] = [
            ref for ref in old_parent_document.data["content"] if not get_ref_id(ref) == source_document.uid
        ]
        # If the parent is not the same, insert ref to new parent.
        if different_parent:
            new_parent_document.data["content"].append(reference)
            destination_document_repository.update(new_parent_document)
        else:
            old_parent_document.data["content"].append(reference)
            source_document_repository.update(old_parent_document)

        return res.ResponseSuccess(destination_document)

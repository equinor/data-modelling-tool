from core.domain.dto import DTO
from core.repository.repository_factory import RepositoryType
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.repository.interface.document_repository import DocumentRepository
from pathlib import Path
from classes.data_source import DataSource
from core.repository.repository_exceptions import EntityNotFoundException, EntityAlreadyExistsException
from core.repository.template_repository import _get_document_id_by_path


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
        source_data_source_uid, source = request_object.source.split("/", 1)
        destination_data_source_uid, destination = request_object.destination.split("/", 1)

        source: Path = Path(source)
        destination: Path = Path(destination)

        source_data_source = DataSource(id=source_data_source_uid)
        destination_data_source = DataSource(id=destination_data_source_uid)

        # Check if already exists
        destination_document_repository: DocumentRepository = self.get_repository(
            RepositoryType.DocumentRepository, destination_data_source
        )

        if _get_document_id_by_path(str(destination), destination_data_source):
            raise EntityAlreadyExistsException(request_object.source)

        # Remove source
        source_uid = _get_document_id_by_path(str(source), source_data_source)
        source_repository: DocumentRepository = self.get_repository(
            RepositoryType.DocumentRepository, source_data_source
        )
        source_document: DTO = source_repository.get(source_uid)
        if not source_document:
            raise EntityNotFoundException(uid=f"{str(source)}")
        source_repository.delete(source_document)
        logger.info(f"Removed document '{source_document.uid}'")

        data = source_document.data
        data["name"] = destination.name

        # Add destination
        destination_document = DTO(uid=source_document.uid, data=data)
        destination_document_repository.add(destination_document)
        logger.info(f"Added document '{destination_document.uid}'")

        # TODO: Update all references that uses the previous source definition

        return res.ResponseSuccess(destination_document.to_dict())

from core.domain.dto import DTO
from core.repository.interface.package_repository import PackageRepository
from utils.enums import RepositoryType
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.repository.interface.document_repository import DocumentRepository
from pathlib import Path
from classes.data_source import DataSource
from core.repository.repository_exceptions import EntityNotFoundException, EntityAlreadyExistsException
from core.utility import get_document_uid_by_path, get_document_by_ref


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

        # Check if document already exists in destination
        if get_document_by_ref(request_object.destination):
            raise EntityAlreadyExistsException(request_object.destination)

        # Remove source document
        source: Path = Path(source)
        source_data_source = DataSource(id=source_data_source_id)
        source_package_repository: PackageRepository = self.get_repository(
            RepositoryType.PackageRepository, source_data_source
        )
        source_document_repository: DocumentRepository = self.get_repository(
            RepositoryType.DocumentRepository, source_data_source
        )
        source_uid = get_document_uid_by_path(str(source), source_package_repository)
        source_document: DTO = source_document_repository.get(source_uid)
        if not source_document:
            raise EntityNotFoundException(uid=f"{str(source)}")
        source_document_repository.delete(source_document)
        logger.info(f"Removed document '{source_document.uid}' from data source '{source_data_source_id}'")

        # Add destination
        destination: Path = Path(destination)
        destination_data_source = DataSource(id=destination_data_source_uid)
        destination_document_repository: DocumentRepository = self.get_repository(
            RepositoryType.DocumentRepository, destination_data_source
        )
        data = source_document.data
        data["name"] = destination.name
        destination_document = DTO(uid=source_document.uid, data=data)
        destination_document_repository.add(destination_document)
        logger.info(f"Added document '{destination_document.uid}' to data source '{destination_data_source_uid}")

        return res.ResponseSuccess(destination_document)

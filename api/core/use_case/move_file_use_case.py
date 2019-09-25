from core.repository.repository_factory import RepositoryType
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.repository.interface.document_repository import DocumentRepository
from pathlib import Path
from core.domain.document import Document
from classes.data_source import DataSource
from core.repository.repository_exceptions import EntityNotFoundException, EntityAlreadyExistsException


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

        # Remove source
        source_repository: DocumentRepository = self.get_repository(
            RepositoryType.DocumentRepository, source_data_source
        )
        source_document: Document = source_repository.get_by_path_and_filename(
            path=f"/{str(source.parent)}", filename=source.name
        )
        if not source_document:
            raise EntityNotFoundException(uid=f"{str(source)}")
        source_repository.delete(source_document)
        logger.info(f"Removed document '{source_document.uid}'")

        # Add destination
        destination_document_repository: DocumentRepository = self.get_repository(
            RepositoryType.DocumentRepository, destination_data_source
        )
        if destination_document_repository.get_by_path_and_filename(
            path=f"/{str(destination.parent)}", filename=destination.name
        ):
            raise EntityAlreadyExistsException(request_object.source)

        destination_document = Document(
            uid=source_document.uid,
            filename=destination.name,
            path=f"/{str(destination.parent)}",
            type=source_document.type,
            template_ref=source_document.template_ref,
        )
        destination_document.form_data = source_document.form_data
        destination_document_repository.add(destination_document)
        logger.info(f"Added document '{destination_document.uid}'")

        return res.ResponseSuccess(destination_document)

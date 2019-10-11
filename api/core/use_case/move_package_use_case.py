from core.domain.document import Document
from core.repository.interface.document_repository import DocumentRepository
from utils.enums import RepositoryType
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from pathlib import Path
from classes.data_source import DataSource
from core.repository.repository_exceptions import EntityNotFoundException, EntityAlreadyExistsException


class MovePackageRequestObject(req.ValidRequestObject):
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


class MovePackageUseCase(uc.UseCase):
    def __init__(self, get_repository):
        self.get_repository = get_repository

    def process_request(self, request_object: MovePackageRequestObject):
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
        source_path = str(source.parent) if str(source.parent) != "." else ""
        source_document: Document = source_repository.get_by_path_and_filename(
            path=f"/{source_path}", filename=source.name
        )
        if not source_document:
            raise EntityNotFoundException(uid=f"{str(source)}")
        source_repository.delete(source_document)
        logger.info(f"Removed document '{source_document.uid}'")

        # Add destination
        destination_document_repository: DocumentRepository = self.get_repository(
            RepositoryType.DocumentRepository, destination_data_source
        )
        destination_path = str(destination.parent) if str(destination.parent) != "." else ""
        if destination_document_repository.get_by_path_and_filename(
            path=f"/{destination_path}", filename=destination.name
        ):
            raise EntityAlreadyExistsException(request_object.source)
        destination_document = Document(
            uid=source_document.uid,
            filename=destination.name,
            path=f"/{destination_path}",
            type=source_document.type,
            template_ref=source_document.template_ref,
        )
        destination_document.form_data = source_document.form_data
        destination_document_repository.add(destination_document)
        logger.info(f"Added document '{destination_document.uid}'")

        start = "" if source_document.path == "/" else source_document.path
        children = (
            source_repository.get_nodes(f"{start}/{source_document.filename}", direct_descendants_only=False)
            if source_document.type == "folder"
            else []
        )
        for child in children:
            child_source_path = f"{source_path}/{source.name}"
            child_destination_path = f"{destination_path}/{destination.name}"
            source_repository.delete(child)
            logger.info(
                f"For child, with id {child.uid}, replace path {child_source_path} with {child_destination_path}"
            )
            child.path = child.path.replace(child_source_path, child_destination_path, 1)
            destination_document_repository.add(child)

        return res.ResponseSuccess(destination_document)

from core.domain.sub_package import SubPackage
from core.repository.repository_factory import RepositoryType
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.repository.interface.sub_package_repository import SubPackageRepository
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
        source_data_source, source_document_id = request_object.source.split("/", 1)
        destination_data_source, destination_document_id = request_object.destination.split("/", 1)

        source: Path = Path(source_document_id)
        destination: Path = Path(destination_document_id)

        source_data_source = DataSource(id=source_data_source)

        destination_data_source = DataSource(id=destination_data_source)

        # Source package
        source_sub_package_repository: SubPackageRepository = self.get_repository(
            RepositoryType.SubPackageRepository, source_data_source
        )
        source_id = f"{source.parent}/package"
        source_package: SubPackage = source_sub_package_repository.get(source_id)
        if not source_package:
            raise EntityNotFoundException(uid=source_id)
        source_package.remove_file(source_document_id)
        logger.info(f"Removed file '{source.name}' from sub package '{source_id}")
        source_sub_package_repository.update(source_package)

        # Destination package
        destination_sub_package_repository: SubPackageRepository = self.get_repository(
            RepositoryType.SubPackageRepository, destination_data_source
        )
        destination_id = f"{destination.parent}/package"
        destination_package: SubPackage = destination_sub_package_repository.get(destination_id)
        if not destination_package:
            raise EntityNotFoundException(uid=destination_id)
        destination_package.add_file(destination.name)
        logger.info(f"Added file '{destination.name}' to sub package '{destination_id}")
        destination_sub_package_repository.update(destination_package)

        # Remove source
        source_document_repository: DocumentRepository = self.get_repository(
            RepositoryType.DocumentRepository, source_data_source
        )
        source_document: Document = source_document_repository.get(source_document_id)
        if not source_document:
            raise EntityNotFoundException(uid=source_document_id)
        source_document_repository.delete(source_document)
        logger.info(f"Removed document '{source_document.id}'")

        # Add destination
        destination_document_repository: DocumentRepository = self.get_repository(
            RepositoryType.DocumentRepository, source_data_source
        )
        destination_document: Document = destination_document_repository.get(destination_document_id)
        if destination_document:
            raise EntityAlreadyExistsException(request_object.source)
        destination_document = Document(id=destination_document_id, template_ref=source_document.meta.template_ref)
        destination_document.form_data = source_document.form_data
        destination_document_repository.add(destination_document)
        logger.info(f"Added document '{destination_document.id}'")

        return res.ResponseSuccess(destination_document)

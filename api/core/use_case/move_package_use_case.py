from core.domain.sub_package import SubPackage
from core.repository.repository_factory import RepositoryType
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.repository.interface.sub_package_repository import SubPackageRepository
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

        # TODO: Check that it is a package

        if invalid_req.has_errors():
            return invalid_req

        return cls(source=adict.get("source"), destination=adict.get("destination"))


class MovePackageUseCase(uc.UseCase):
    def __init__(self, get_repository):
        self.get_repository = get_repository

    def process_request(self, request_object: MovePackageRequestObject):
        source_data_source, source_package_id = request_object.source.split("/", 1)
        destination_data_source, destination_package_id = request_object.destination.split("/", 1)

        source: Path = Path(source_package_id)
        destination: Path = Path(destination_package_id)

        source_data_source = DataSource(id=source_data_source)
        destination_data_source = DataSource(id=destination_data_source)

        # Source package
        source_sub_package_repository: SubPackageRepository = self.get_repository(
            RepositoryType.SubPackageRepository, source_data_source
        )
        source_id = f"{source.parent.parent}/package"
        source_package: SubPackage = source_sub_package_repository.get(source_id)
        if not source_package:
            raise EntityNotFoundException(uid=source_id)
        source_package.remove_subpackage(source_package_id)
        logger.info(f"Removed file '{source.name}' from sub package '{source_id}")
        source_sub_package_repository.update(source_package)

        # Destination package
        destination_sub_package_repository: SubPackageRepository = self.get_repository(
            RepositoryType.SubPackageRepository, destination_data_source
        )
        destination_id = f"{destination.parent.parent}/package"
        destination_package: SubPackage = destination_sub_package_repository.get(destination_id)
        if not destination_package:
            raise EntityNotFoundException(uid=destination_id)
        destination_package.add_subpackage(destination.parent.name)
        logger.info(f"Added file '{destination.parent.name}' to sub package '{destination_id}")
        destination_sub_package_repository.update(destination_package)

        # Remove source
        source_sub_package: SubPackage = source_sub_package_repository.get(source_package_id)
        if not source_sub_package:
            raise EntityNotFoundException(uid=source_package_id)
        source_sub_package_repository.delete(source_sub_package)
        logger.info(f"Removed sub package '{source_sub_package.id}'")

        # Add destination
        destination_sub_package: SubPackage = destination_sub_package_repository.get(destination_package_id)
        if destination_sub_package:
            raise EntityAlreadyExistsException(request_object.source)
        destination_sub_package = SubPackage(
            id=destination_package_id,
            template_ref=source_sub_package.meta.template_ref,
            document_type=source_sub_package.meta.document_type,
        )
        destination_sub_package.form_data = source_sub_package.form_data
        destination_sub_package_repository.add(destination_sub_package)
        logger.info(f"Added sub package '{destination_sub_package.id}'")

        return res.ResponseSuccess(destination_sub_package)

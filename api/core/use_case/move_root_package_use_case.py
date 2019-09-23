from core.domain.sub_package import SubPackage
from core.repository.interface.root_package_repository import RootPackageRepository
from core.repository.repository_factory import RepositoryType
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.repository.interface.sub_package_repository import SubPackageRepository
from pathlib import Path
from classes.data_source import DataSource
from core.repository.repository_exceptions import EntityNotFoundException, EntityAlreadyExistsException
from core.domain.root_package import RootPackage


class MoveRootPackageRequestObject(req.ValidRequestObject):
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


class MoveRootPackageUseCase(uc.UseCase):
    def __init__(self, get_repository):
        self.get_repository = get_repository

    def process_request(self, request_object: MoveRootPackageRequestObject):
        source_data_source, source_package_id = request_object.source.split("/", 1)
        destination_data_source, destination_package_id = request_object.destination.split("/", 1)

        destination: Path = Path(destination_package_id)

        latest_version_id = f"{destination.parent}/1.0.0/package"

        source_data_source = DataSource(id=source_data_source)
        destination_data_source = DataSource(id=destination_data_source)

        # Source
        source_repository: RootPackageRepository = self.get_repository(
            RepositoryType.RootPackageRepository, source_data_source
        )
        source_root_package: RootPackage = source_repository.get(source_package_id)
        if not source_root_package:
            raise EntityNotFoundException(uid=source_package_id)
        source_repository.delete(source_root_package)
        logger.info(f"Removed root package '{source_root_package.id}'")

        # Destination
        destination_repository: RootPackageRepository = self.get_repository(
            RepositoryType.RootPackageRepository, destination_data_source
        )
        destination_root_package: RootPackage = destination_repository.get(destination_package_id)
        if destination_root_package:
            raise EntityAlreadyExistsException(request_object.source)
        destination_instance = RootPackage(
            id=destination_package_id, template_ref=source_root_package.meta.template_ref
        )
        destination_instance.form_data.description = source_root_package.form_data.description
        destination_instance.form_data.latest_version = latest_version_id
        destination_instance.form_data.versions = [latest_version_id]
        destination_repository.add(destination_instance)
        logger.info(f"Added root package '{destination_instance.id}'")

        # Remove version
        source_repository: SubPackageRepository = self.get_repository(
            RepositoryType.SubPackageRepository, source_data_source
        )
        old_version = source_repository.get(source_root_package.form_data.latest_version)
        if not old_version:
            logger.info(f"Could not find latest version '{source_root_package.form_data.latest_version}'")
            raise EntityNotFoundException(uid=old_version)
        source_repository.delete(old_version)
        logger.info(f"Removed old version  '{old_version.id}'")

        # Create version
        destination_repository: SubPackageRepository = self.get_repository(
            RepositoryType.SubPackageRepository, destination_data_source
        )
        latest_version_package: SubPackage = SubPackage(
            id=latest_version_id,
            template_ref="templates/package-template",
            document_type="version",
            form_data=old_version.form_data,
        )
        destination_repository.add(latest_version_package)

        return res.ResponseSuccess(destination_instance)

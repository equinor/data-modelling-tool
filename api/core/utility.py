from typing import List, Union, Optional

from classes.data_source import DataSource
from config import Config
from core.domain.dto import DTO
from core.domain.package import Package
from core.repository.repository_factory import get_repository
from core.enums import RepositoryType
from services.database import model_db, data_modelling_tool_db as dmt_db
from utils.helper_functions import get_data_source_and_path, get_package_and_path
from utils.logging import logger


def _find_document_in_package_by_path(package: Package, path_elements: List[str], repository) -> Union[str, Package]:
    """
    :param package: A Package object to search down into
    :param path_elements: A list representation of the path to the document. Starting from _this_ package

    :return: The uid of the requested document, or the next Package object in the path.
    """
    if len(path_elements) == 1:
        try:
            return [file["_id"] for file in package.content if file["name"] == path_elements[0]][0]
        except IndexError:
            logger.error(f"The document {path_elements[0]} could not be found in the package {package.name}")
    else:
        try:
            next_package = [package for package in package.content if package["name"] == path_elements[0]][0]
            next_package = Package.from_dict(repository.find({"_id": next_package["_id"]}).data)
            del path_elements[0]
            return _find_document_in_package_by_path(next_package, path_elements, repository)
        except IndexError:
            logger.error(f"The package {path_elements[0]} could not be found in the package {package.name}")


def get_document_uid_by_path(path: str, repository) -> Union[str, None]:
    root_package_name, path_elements = get_package_and_path(path)
    root_package: Optional[DTO] = repository.find({"name": root_package_name, "isRoot": True})
    if not root_package:
        return None
    # Check if it's a root-package
    if not path_elements:
        return root_package.uid
    package = Package.from_dict(root_package.data)
    uid = _find_document_in_package_by_path(package, path_elements, repository)
    return uid


def get_document_by_ref(type_ref) -> DTO:
    # TODO: Get DataSource from Package's config file
    data_source_id, path = get_data_source_and_path(type_ref)
    repository = get_repository(RepositoryType.DocumentRepository, DataSource(data_source_id))
    type_id = get_document_uid_by_path(path, repository)
    return repository.get(uid=type_id)


def wipe_db():
    print("Dropping all collections")
    # FIXME: Read names from the database
    for name in [Config.BLUEPRINT_COLLECTION, Config.ENTITY_COLLECTION, Config.SYSTEM_COLLECTION, "documents"]:
        print(f"Dropping collection '{name}'")
        model_db.drop_collection(name)
        dmt_db.drop_collection(name)

from typing import List, Union

from classes.data_source import DataSource
from config import Config
from classes.dto import DTO
from core.repository.repository_factory import get_repository
from services.database import dmt_database
from utils.helper_functions import get_data_source_and_path, get_package_and_path
from utils.logging import logger


def _find_document_in_package_by_path(package: DTO, path_elements: List[str], repository) -> Union[str, dict, None]:
    """
    :param package: A Package object to search down into
    :param path_elements: A list representation of the path to the document. Starting from _this_ package

    :return: The uid of the requested document, or the next Package object in the path.
    """
    if len(path_elements) == 1:
        target = path_elements[0]
        file = next((f for f in package["content"] if f.get("name") == target), None)
        if not file:
            logger.error(f"The document {target} could not be found in the package {package.name}")
            return
        return file["_id"]
    else:
        next_package = next((p for p in package["content"] if p["name"] == path_elements[0]), None)
        if not next_package:
            logger.error(f"The package {path_elements[0]} could not be found in the package {package.name}")
            return
        next_package: DTO = repository.find({"_id": next_package["_id"]})
        del path_elements[0]
        return _find_document_in_package_by_path(next_package, path_elements, repository)


def get_document_uid_by_path(path: str, repository) -> Union[str, None]:
    root_package_name, path_elements = get_package_and_path(path)
    root_package: DTO = repository.find({"name": root_package_name, "isRoot": True})
    if not root_package:
        return None
    # Check if it's a root-package
    if not path_elements:
        return root_package.uid
    uid = _find_document_in_package_by_path(root_package, path_elements, repository)
    return uid


def get_document_by_ref(type_ref) -> DTO:
    # TODO: Get DataSource from Package's config file
    data_source_id, path = get_data_source_and_path(type_ref)
    data_source = DataSource(data_source_id)
    document_repository = get_repository(data_source)
    type_id = get_document_uid_by_path(path, document_repository)
    if not type_id:
        return
    return document_repository.get(uid=type_id)


def wipe_db():
    print("Dropping all collections")
    # FIXME: Read names from the database
    for name in [Config.BLUEPRINT_COLLECTION, Config.ENTITY_COLLECTION, Config.SYSTEM_COLLECTION, "documents"]:
        print(f"Dropping collection '{name}'")
        dmt_database.drop_collection(name)

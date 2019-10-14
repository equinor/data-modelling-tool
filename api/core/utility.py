from typing import List, Union

from classes.data_source import DataSource
from core.domain.dto import DTO
from core.domain.package import Package
from core.repository.repository_factory import get_repository
from utils.enums import RepositoryType
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
            # TODO: objects instead of lists in blueprints and packages?
            packages = [package.to_dict() for package in package.packages]
            files_in_folder = packages + package.documents
            return [file["_id"] for file in files_in_folder if file["name"] == path_elements[0]][0]
        except IndexError:
            logger.error(f"The document {path_elements[0]} could not be found in the package {package.name}")
    else:
        try:
            next_package = [package for package in package.packages if package.name == path_elements[0]][0]
            # TODO: This should be "if contained"
            # If the packages is not contained, get it
            if next_package.type == "ref":
                next_package = Package.from_dict(repository.find({"_id": next_package.uid}))

            path_elements.pop(0)
            return _find_document_in_package_by_path(next_package, path_elements, repository)
        except IndexError:
            logger.error(f"The package {path_elements[0]} could not be found in the package {package.name}")


def get_document_uid_by_path(path: str, repository) -> Union[str, None]:
    root_package_name, path_elements = get_package_and_path(path)
    # TODO: This fails if several documents with the same name
    package_dict = repository.find({"name": root_package_name})
    if not package_dict:
        return None
    package = Package.from_dict(package_dict)
    # Check if it's a root-package
    if not path_elements:
        return package.uid
    uid = _find_document_in_package_by_path(package, path_elements, repository)
    return uid


def get_document_by_ref(type_ref) -> DTO:
    # TODO: Get DataSource from Package's config file
    data_source_id, path = get_data_source_and_path(type_ref)
    repository = get_repository(RepositoryType.DocumentRepository, DataSource(data_source_id))
    type_id = get_document_uid_by_path(path, repository)
    return repository.get(uid=type_id)

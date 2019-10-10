from typing import List

from classes.data_source import DataSource
from core.domain.dto import DTO
from core.domain.package import Package
from core.repository.repository_factory import get_repository, RepositoryType
from utils.logging import logger


def _find_document_in_package_by_path(package: Package, path_elements: List, data_source: DataSource) -> str:
    """
    :param package: A Package object to search down into
    :param path_elements: A list representation of the path to the document. Starting from _this_ package

    :return: The uid of the requested document, OR the next Package object in the path.
    """
    if len(path_elements) == 1:
        try:
            # TODO: objects instead of lists in blueprints and packages?
            packages = [package.to_dict() for package in package.packages]
            files_in_folder = packages + package.blueprints
            return [file["_id"] for file in files_in_folder if file["name"] == path_elements[0]][0]
        except IndexError:
            logger.error(f"The document {path_elements[0]} could not be found in the package {package.name}")
            return None
    else:
        try:
            next_package = [package for package in package.packages if package.name == path_elements[0]][0]
            if next_package.type == "ref":
                dict = data_source.client.find_one({"_id": next_package.uid})
                next_package = Package.from_dict(dict)
        except IndexError:
            logger.error(f"The package {path_elements[0]} could not be found in the package {package.name}")

        path_elements.pop(0)
        return _find_document_in_package_by_path(next_package, path_elements, data_source)


def get_document_uid_by_path(path: str, data_source) -> str:
    ref_elements = path.split("/", 1)
    package_name = ref_elements[0]
    package_dict = data_source.client.find_one({"name": package_name})
    if not package_dict:
        return None
    package = Package.from_dict(package_dict)
    # Check if it's a root-package
    if len(ref_elements) > 1:
        path_elements = ref_elements[1].split("/")
        uid = _find_document_in_package_by_path(package, path_elements, data_source)
        return uid
    else:
        return package.uid


# TODO: Move to blueprint repo?
def get_document_by_ref(type_ref) -> DTO:
    # TODO: Get DataSource from Package's config file
    ref_elements = type_ref.split("/", 1)
    if len(ref_elements) <= 1:
        raise Exception(f"Invalid reference: {type_ref}")
    data_source_id = ref_elements[0]
    # TODO: Use Document repository
    data_source = DataSource(data_source_id)
    type_id = get_document_uid_by_path(ref_elements[1], data_source)

    document_repository = get_repository(RepositoryType.DocumentRepository, data_source)

    return document_repository.get(type_id)

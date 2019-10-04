from typing import List

from classes.data_source import DataSource
from core.domain.blueprint import Blueprint
from core.domain.package import Package
from core.repository.repository_factory import get_repository, RepositoryType


def _find_document_in_package_by_path(package: Package, path_elements: List) -> str:
    """
    :param package: A Package object to search down into
    :param path_elements: A list representation of the path to the document. Starting from _this_ package

    :return: The requested document as a dict, OR the next Package object in the path.
    """
    if len(path_elements) == 1:
        try:
            # TODO: objects instead of lists in blueprints and packages?
            return [blueprint["uid"] for blueprint in package.blueprints if blueprint["name"] == path_elements[0]][0]
        except IndexError:
            raise Exception(f"The document {path_elements[0]} could not be found in the package {package.name}")

    else:
        try:
            next_package = [package for package in package.packages if package.name == path_elements[0]][0]
        except IndexError:
            raise Exception(f"The package {path_elements[0]} could not be found in the package {package.name}")

        path_elements.pop(0)
        return _find_document_in_package_by_path(next_package, path_elements)


def _get_document_id_by_path(path: str, data_source) -> str:
    ref_elements = path.split("/", 1)
    package_name = ref_elements[0]
    path_elements = ref_elements[1].split("/")

    package = Package.from_dict(data_source.client.find_one({"name": package_name}))

    uid = _find_document_in_package_by_path(package, path_elements)

    return uid


def get_template_by_document_type(type_ref) -> Blueprint:
    # TODO: Get DataSource from Package's config file
    data_source_id = type_ref.split("/", 1)[0]
    data_source = DataSource(data_source_id)
    type_path = type_ref.split("/", 1)[1]
    type_id = _get_document_id_by_path(type_path, data_source)

    # TODO: Create PackageRepository
    document_repository = get_repository(RepositoryType.DocumentRepository, data_source)

    return document_repository.get_by_id(type_id)

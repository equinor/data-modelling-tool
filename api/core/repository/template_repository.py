from typing import List

from classes.data_source import DataSource
from core.domain.dto import DTO
from core.domain.package import Package
from core.repository.repository_factory import get_repository, RepositoryType


def _find_document_in_package_by_path(package: Package, path_elements: List, data_source: DataSource) -> str:
    """
    :param package: A Package object to search down into
    :param path_elements: A list representation of the path to the document. Starting from _this_ package

    :return: The requested document as a dict, OR the next Package object in the path.
    """
    if len(path_elements) == 1:
        # TODO: Should not crash when it can't resolve reference
        try:
            # TODO: objects instead of lists in blueprints and packages?
            return [blueprint["_id"] for blueprint in package.blueprints if blueprint["name"] == path_elements[0]][0]
        except IndexError:
            raise Exception(f"The document {path_elements[0]} could not be found in the package {package.name}")

    else:
        try:
            next_package = [package for package in package.packages if package.name == path_elements[0]][0]
            if next_package.type == "ref":
                dict = data_source.client.find_one({"_id": next_package.uid})
                next_package = Package.from_dict(dict)
        except IndexError:
            raise Exception(f"The package {path_elements[0]} could not be found in the package {package.name}")

        path_elements.pop(0)
        return _find_document_in_package_by_path(next_package, path_elements, data_source)


def _get_document_id_by_path(path: str, data_source) -> str:
    ref_elements = path.split("/", 1)
    package_name = ref_elements[0]
    temp = data_source.client.find_one({"name": package_name})
    if not temp:
        return None
    package = Package.from_dict(temp)
    if len(ref_elements) > 1:
        path_elements = ref_elements[1].split("/")
        uid = _find_document_in_package_by_path(package, path_elements, data_source)
        return uid
    else:
        return package.uid


# TODO: Move to blueprint repo?
def get_template_by_document_type(type_ref) -> DTO:
    # TODO: Get DataSource from Package's config file
    ref_elements = type_ref.split("/", 1)
    if len(ref_elements) <= 1:
        raise Exception(f"Invalid reference: {type_ref}")
    data_source_id = ref_elements[0]
    # TODO: Use repository
    data_source = DataSource(data_source_id)
    type_path = ref_elements[1]
    type_id = _get_document_id_by_path(type_path, data_source)

    # TODO: Create PackageRepository
    document_repository = get_repository(RepositoryType.DocumentRepository, data_source)

    return document_repository.get(type_id)

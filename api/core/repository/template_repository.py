from typing import List

from classes.data_source import DataSource
from config import Config
from core.domain.blueprint import Blueprint, Package
from core.domain.template import Template
from core.repository.repository_exceptions import EntityNotFoundException
from core.repository.repository_factory import get_repository, RepositoryType
from services.database import data_modelling_tool_db


def find_file_recursive(counter: int, path_elements: List, package: Package) -> str:
    if counter == 1:
        return [blueprint["uid"] for blueprint in package.blueprints if blueprint["name"] == path_elements[0]][0]
    else:
        counter -= 1
        # TODO: objects over lists in blueprins and packages?
        next_package = [package for package in package.packages if package.name == path_elements[counter]][0]
        return find_file_recursive(counter, path_elements, next_package)


def get_document_id_by_path(path: str, data_source) -> str:
    # ref_elements = "package_1:subdir/subdir2/FuelPump".split(":", 1)
    ref_elements = path.split("/", 1)
    package_name = ref_elements[0]
    path_elements = ref_elements[1].split("/")

    package = Package.from_dict(data_source.client.find_one({"name": package_name}))

    counter = len(path_elements)
    path_elements.reverse()
    uid = find_file_recursive(counter, path_elements, package)

    return uid


def get_template_by_document_type(type_ref) -> Blueprint:
    data_source_id = type_ref.split("/", 1)[0]
    type_path = type_ref.split("/", 1)[1]
    data_source = DataSource(data_source_id)
    # TODO: Create PackageRepository
    document_repository = get_repository(RepositoryType.DocumentRepository, data_source)

    type_id = get_document_id_by_path(type_path, data_source)

    return document_repository.get(type_id)


def get_template_by_name(name: str) -> Template:
    dmt_template = data_modelling_tool_db[Config.TEMPLATES_COLLECTION].find_one(filter={"name": name})
    if not dmt_template:
        raise EntityNotFoundException(uid=name)
    return dmt_template

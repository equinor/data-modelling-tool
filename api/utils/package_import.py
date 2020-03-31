import json
import os
from typing import Dict, List, Union

from classes.dto import DTO
from classes.schema import Factory
from config import Config
from core.enums import DMT
from core.repository.file import TemplateRepositoryFromFile
from core.repository.repository_exceptions import InvalidDocumentNameException
from core.utility import url_safe_name
from services.database import dmt_database as dmt_db
from utils.helper_functions import schemas_location
from utils.logging import logger


def get_template_type(directory: str, file: str) -> str:
    path = f"{directory}/{file}"
    if path.endswith(".json"):
        path = path[: -len(".json")]
    if "/core/" in path:
        path = replace_prefix(path, "system", "core")
    elif "/blueprints/" in path:
        path = replace_prefix(path, "SSR-DataSource", "blueprints")
    else:
        raise ValueError
    return path


def replace_prefix(path, prefix, where):
    index = path.find(f"/{where}/")
    return f"{prefix}/{path[index + len(f'/{where}/'):]}"


def _get_dependencies(schema):
    template_repository = TemplateRepositoryFromFile(schemas_location())
    factory = Factory(template_repository, read_from_file=True)
    dependencies = factory._get_dependencies(schema)
    return [f"{dependency.__name__}.json" for dependency in dependencies if dependency]


def _ensure_sensible_import_order(path: str, documents: List[str]) -> List[str]:
    _order = []
    for document in documents:
        with open(f"{path}/{document}") as f:
            schema = json.load(f)
        _order.extend(_get_dependencies(schema))
    order = []
    for element in _order:
        if element not in order and element in documents:
            order.append(element)
    return order + [document for document in documents if document not in order]


def _add_documents(path, documents, collection, is_entity=False) -> List[Dict]:
    docs = []
    if Config.VERIFY_IMPORTS and collection == Config.SYSTEM_COLLECTION:
        documents = _ensure_sensible_import_order(path, documents)
    for file in documents:
        logger.info(f"Working on {file}...")
        with open(f"{path}/{file}") as json_file:
            data = json.load(json_file)
        # TODO: This does not work on all entities (empty non-optional lists?)
        if Config.VERIFY_IMPORTS:
            template_repository = TemplateRepositoryFromFile(schemas_location())
            factory = Factory(template_repository, read_from_file=True)
            if is_entity:
                Blueprint = factory.create(data["type"])
                instance = Blueprint.from_dict(data)
            else:
                Blueprint = factory.create(get_template_type(path, file))

        document = DTO(data)
        if not url_safe_name(document.name):
            raise InvalidDocumentNameException(document.name)

        dmt_db[collection].replace_one({"_id": document.uid}, document.data, upsert=True)
        docs.append({"_id": document.uid, "name": document.name, "type": document.type})
    return docs


def import_package(path, collection: str, is_root: bool = False, is_entity=False) -> Union[Dict]:
    # TODO: Package class
    package = {"name": os.path.basename(path), "type": DMT.PACKAGE.value, "isRoot": is_root}
    files = []
    directories = []
    for (path, directory, file) in os.walk(path):
        directories.extend(directory)
        files.extend(file)
        break

    package["content"] = _add_documents(path, documents=files, collection=collection, is_entity=is_entity)
    for folder in directories:
        package["content"].append(import_package(f"{path}/{folder}", is_root=False, collection=collection))

    package = DTO(package)
    dmt_db[collection].replace_one({"_id": package.uid}, package.data, upsert=True)
    logger.info(f"Imported package {package.name}")
    return {"_id": package.uid, "name": package.name, "type": package.type}

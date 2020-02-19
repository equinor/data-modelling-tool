import json
import os
from typing import Dict, List, Union

from classes.dto import DTO
from config import Config
from core.enums import DMT, SIMOS

from classes.schema import Factory
from core.repository.file import TemplateRepositoryFromFile
from services.database import dmt_database as dmt_db
from utils.logging import logger

from utils.helper_functions import schemas_location


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


def _add_documents(path, documents, collection, is_entity=False) -> List[Dict]:
    docs = []
    for file in documents:
        logger.info(f"Working on {file}...")
        with open(f"{path}/{file}") as json_file:
            data = json.load(json_file)
        if Config.VERIFY_IMPORTS:
            template_repository = TemplateRepositoryFromFile(schemas_location())
            factory = Factory(template_repository, read_from_file=True)
            if is_entity:
                Blueprint = factory.create(data["type"])
                instance = Blueprint.from_dict(data)
            else:
                Blueprint = factory.create(get_template_type(path, file))
        if data["type"] == SIMOS.BLUEPRINT.value:
            document = DTO(data)
        else:
            document = DTO(data)
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

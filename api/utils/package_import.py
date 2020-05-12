import json
import os
from typing import Dict, List, Union

from pymongo import MongoClient

from classes.dto import DTO
from classes.schema import Factory
from config import Config
from core.enums import DMT
from core.repository.file import TemplateRepositoryFromFile
from core.repository.repository_exceptions import InvalidDocumentNameException
from core.utility import url_safe_name
from utils.helper_functions import schemas_location
from utils.logging import logger

from core.service.document_service import explorer_api


def _add_documents(path, documents) -> List[Dict]:
    docs = []

    for file in documents:
        logger.info(f"Working on {file}...")
        with open(f"{path}/{file}") as json_file:
            data = json.load(json_file)

        document = DTO(data)
        if not url_safe_name(document.name):
            raise InvalidDocumentNameException(document.name)

        explorer_api.add_raw(Config.APPLICATION_DATA_SOURCE, document.to_dict())
        docs.append({"_id": document.uid, "name": document.name, "type": document.type})
    return docs


def import_package(path, is_root: bool = False) -> Union[Dict]:
    package = {"name": os.path.basename(path), "type": DMT.PACKAGE.value, "isRoot": is_root}
    files = []
    directories = []
    for (path, directory, file) in os.walk(path):
        directories.extend(directory)
        files.extend(file)
        break

    package["content"] = _add_documents(path, documents=files)
    for folder in directories:
        package["content"].append(import_package(f"{path}/{folder}", is_root=False))

    package = DTO(package)
    explorer_api.add_raw(Config.APPLICATION_DATA_SOURCE, package.to_dict())
    logger.info(f"Imported package {package.name}")
    return {"_id": package.uid, "name": package.name, "type": package.type}

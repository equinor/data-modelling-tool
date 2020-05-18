import json
import os
from typing import Dict, List, Union

from core.repository.repository_exceptions import InvalidDocumentNameException

from classes.dto import DTO
from config import Config
from core.enums import DMT
from core.service.document_service import explorer_api
from core.utility import url_safe_name
from utils.logging import logger


def _add_documents(path, data_source, documents) -> List[Dict]:
    docs = []

    for file in documents:
        logger.info(f"Working on {file}...")
        with open(f"{path}/{file}") as json_file:
            data = json.load(json_file)

        document = DTO(data)
        if not url_safe_name(document.name):
            raise InvalidDocumentNameException(document.name)

        explorer_api.add_raw(data_source, document.to_dict())
        docs.append({"_id": document.uid, "name": document.name, "type": document.type})
    return docs


def import_package(path, data_source: str, is_root: bool = False) -> Union[Dict]:
    package = {"name": os.path.basename(path), "type": DMT.PACKAGE.value, "isRoot": is_root}
    files = []
    directories = []
    for (path, directory, file) in os.walk(path):
        directories.extend(directory)
        files.extend(file)
        break

    package["content"] = _add_documents(path=path, data_source=data_source, documents=files)
    for folder in directories:
        package["content"].append(import_package(f"{path}/{folder}", data_source=data_source, is_root=False))

    package = DTO(package)
    explorer_api.add_raw(data_source, package.to_dict())
    logger.info(f"Imported package {package.name}")
    return {"_id": package.uid, "name": package.name, "type": package.type}

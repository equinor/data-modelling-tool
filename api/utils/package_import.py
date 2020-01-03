import json
import os
from typing import Dict, List, Union

from classes.dto import DTO
from core.enums import DMT, SIMOS
from services.database import dmt_database as dmt_db
from utils.logging import logger


def _add_documents(path, documents, collection) -> List[Dict]:
    docs = []
    for file in documents:
        logger.info(f"Working on {file}...")
        with open(f"{path}/{file}") as json_file:
            data = json.load(json_file)
        if data["type"] == SIMOS.BLUEPRINT.value:
            document = DTO(data)
        else:
            document = DTO(data)
        dmt_db[collection].replace_one({"_id": document.uid}, document.data, upsert=True)
        docs.append({"_id": document.uid, "name": document.name, "type": document.type})
    return docs


def import_package(path, collection: str, is_root: bool = False) -> Union[Dict]:
    # TODO: Package class
    package = {"name": os.path.basename(path), "type": DMT.PACKAGE.value, "isRoot": is_root}
    files = []
    directories = []
    for (path, directory, file) in os.walk(path):
        directories.extend(directory)
        files.extend(file)
        break

    package["content"] = _add_documents(path, documents=files, collection=collection)
    for folder in directories:
        package["content"].append(import_package(f"{path}/{folder}", is_root=False, collection=collection))

    package = DTO(package)
    dmt_db[collection].replace_one({"_id": package.uid}, package.data, upsert=True)
    logger.info(f"Imported package {package.name}")
    return {"_id": package.uid, "name": package.name, "type": package.type}

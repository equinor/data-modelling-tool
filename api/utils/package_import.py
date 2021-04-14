import json
import os
from typing import Dict, List, Union


from classes.dto import DTO
from core.enums import DMT
from services.data_modelling_document_service import dmss_api
from utils.logging import logger


def _add_documents(path, data_source, documents) -> List[Dict]:
    docs = []

    for file in documents:
        logger.info(f"Working on {file}...")
        with open(f"{path}/{file}") as json_file:
            data = json.load(json_file)

        document = DTO(data)
        dmss_api.explorer_add_raw(data_source, document.to_dict())
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
    dmss_api.explorer_add_raw(data_source, package.to_dict())
    logger.info(f"Imported package {package.name}")
    return {"_id": package.uid, "name": package.name, "type": package.type}

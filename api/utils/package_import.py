import json
import os
from typing import Dict, List, Union

from core.domain.blueprint import Blueprint
from core.domain.dto import DTO
from core.domain.entity import Entity
from core.domain.package import Package
from services.database import dmt_database as dmt_db
from core.enums import DMT, SIMOS
from utils.logging import logger


def _add_documents(path, documents, collection) -> List[Dict]:
    docs = []
    for file in documents:
        logger.info(f"Working on {file}...")
        with open(f"{path}/{file}") as json_file:
            data = json.load(json_file)
        if data["type"] == SIMOS.BLUEPRINT.value:
            document = DTO(Blueprint.from_dict(data))
        else:
            document = DTO(Entity(data))
        dmt_db[collection].replace_one({"_id": document.uid}, document.data.to_dict(), upsert=True)
        docs.append({"_id": document.uid, "name": document.name, "type": document.type})
    return docs


def import_package(path, collection: str, is_root: bool = False) -> Union[Package, Dict]:
    package = Package(name=os.path.basename(path), type=DMT.PACKAGE.value, is_root=is_root)
    package.content = _add_documents(path, documents=next(os.walk(path))[2], collection=collection)

    for folder in next(os.walk(path))[1]:
        package.content.append(import_package(f"{path}/{folder}", is_root=False, collection=collection))

    package = DTO(package)
    dmt_db[collection].replace_one({"_id": package.uid}, package.data.to_dict(), upsert=True)
    logger.info(f"Imported package {package.name}")
    return {"_id": package.uid, "name": package.name, "type": package.type}

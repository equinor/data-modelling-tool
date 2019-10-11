import json
import os
from typing import Dict, List, Union
from uuid import uuid4

from config import Config
from core.domain.blueprint import Blueprint
from core.domain.entity import Entity
from core.domain.package import Package
from services.database import data_modelling_tool_db as dmt_db
from utils.logging import logger


def _add_documents(path, documents, collection) -> List[Dict]:
    docs = []
    for file in documents:
        print(f"Working on {file}...")
        with open(f"{path}/{file}") as json_file:
            data = json.load(json_file)
        data["uid"] = str(uuid4())
        if data["type"] == Config.MASTER_BLUEPRINT:
            document = Blueprint.from_dict(data)
        else:
            # TODO: Good candidate to become a DTO
            document = Entity(data)
        dmt_db[collection].replace_one({"_id": document.uid}, document.to_dict(), upsert=True)
        # TODO: Remove "type: ref"
        docs.append({"_id": document.uid, "name": document.name, "type": "ref"})
    return docs


def import_package(
    path, collection: str, root_package_uid: str = None, contained: bool = True, is_root: bool = False
) -> Union[Package, Dict]:
    package = Package(name=os.path.basename(path), uid=str(uuid4() if not contained else root_package_uid))
    package.documents = _add_documents(path, documents=next(os.walk(path))[2], collection=collection)

    for folder in next(os.walk(path))[1]:
        package.packages.append(
            import_package(
                f"{path}/{folder}",
                contained=contained,
                is_root=False,
                root_package_uid=root_package_uid,
                collection=collection,
            )
        )

    if not contained:
        # TODO: isRoot should not be needed
        as_dict = package.to_dict()
        as_dict["isRoot"] = is_root
        dmt_db[collection].replace_one({"_id": package.uid}, as_dict, upsert=True)
        logger.info(f"Imported package {package.name}")
        return {"_id": package.uid, "name": package.name, "type": "ref"}
    else:
        return package

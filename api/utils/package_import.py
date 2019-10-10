import json
import os
from typing import Dict, Union
from uuid import uuid4

from core.domain.blueprint import Blueprint
from core.domain.entity import Entity
from core.domain.package import Package
from services.database import data_modelling_tool_db as dmt_db
from utils.logging import logger


def _add_documents(path, documents):
    docs = []
    for document in documents:
        with open(f"{path}/{document}") as json_file:
            data = json.load(json_file)
        data["uid"] = str(uuid4())
        # TODO: Remove hardcoded String
        if data["type"] == "templates/SIMOS/Blueprint":
            blueprint = Blueprint.from_dict(data)
        else:
            blueprint = Entity(data)
            # TODO: dont store binary in mongo
            data = blueprint.to_dict()
            data["_id"] = blueprint.uid
            data["_uid"] = blueprint.uid
        dmt_db.templates.replace_one({"_id": blueprint.uid}, data, upsert=True)
        docs.append({"_id": blueprint.uid, "name": blueprint.name, "type": "ref"})
    return docs


def import_package(path, uncontained: bool = False, is_root: bool = False) -> Union[Package, Dict]:
    package = Package(name=os.path.basename(path), description="", blueprints=[], uid=str(uuid4()))
    package.blueprints = _add_documents(path, next(os.walk(path))[2])

    for folder in next(os.walk(path))[1]:
        package.packages.append(import_package(f"{path}/{folder}", uncontained, is_root=False))

    if uncontained:
        # TODO: isRoot should not be needed
        as_dict = package.to_dict()
        as_dict["isRoot"] = is_root
        dmt_db.templates.replace_one({"_id": package.uid}, as_dict, upsert=True)
        logger.info(f"Imported package {package.name}")
        return {"_id": package.uid, "name": package.name, "type": "ref"}
    else:
        return package

import json
import os
from typing import Dict, Union
from uuid import uuid4

from core.domain.blueprint import Blueprint
from core.domain.entity import Entity
from core.domain.package import Package
from services.database import data_modelling_tool_db as dmt_db
from utils.logging import logger


def _add_documents(path, documents, dmt_templates: bool = False):
    docs = []
    for document in documents:
        with open(f"{path}/{document}") as json_file:
            data = json.load(json_file)

        if data["type"] == "templates/SIMOS/blueprint":
            document = Blueprint.from_dict(data)
        else:
            document = Entity(data)

        data["uid"] = str(uuid4())

        dmt_db.templates.replace_one({"_id": document.uid}, document.to_dict(), upsert=True)

        docs.append({"_id": document.uid, "name": document.name, "type": "ref"})
    return docs


# TODO: All to same data-source
def import_package(path, uncontained: bool = False, is_root: bool = False) -> Union[Package, Dict]:
    package = Package(name=os.path.basename(path), description="", blueprints=[], uid=str(uuid4()))

    package.blueprints = _add_documents(path, next(os.walk(path))[2])

    for folder in next(os.walk(path))[1]:
        package.packages.append(import_package(f"{path}/{folder}", uncontained, is_root=False))

    if uncontained:
        # TODO: Should not be needed
        as_dict = package.to_dict()
        as_dict["isRoot"] = is_root
        print(package.uid)
        dmt_db.templates.replace_one({"_id": package.uid}, as_dict, upsert=True)
        logger.info(f"Imported package {package.name}")
        return {"_id": package.uid, "name": package.name, "type": "ref"}
    else:
        return package

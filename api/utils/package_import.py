import json
import os
from typing import Dict, List, Union, Tuple
from uuid import uuid4

from config import Config
from core.domain.blueprint import Blueprint
from core.domain.entity import Entity
from core.domain.package import Package
from utils.enums import SIMOS, DMT
from services.database import data_modelling_tool_db as dmt_db
from utils.logging import logger


def _add_documents(path, documents, collection) -> Tuple[List[Dict], List[Dict]]:
    docs = []
    app_settings = []
    for file in documents:
        with open(f"{path}/{file}") as json_file:
            data = json.load(json_file)
        data["uid"] = str(uuid4())

        if data["type"] == SIMOS.BLUEPRINT.value:
            document = Blueprint.from_dict(data)
        else:
            # TODO: Good candidate to become a DTO
            document = Entity(data)

        dmt_db[collection].replace_one({"_id": document.uid}, document.to_dict(), upsert=True)

        if data["type"] == SIMOS.APPLICATION.value:
            app_settings.append({"_id": document.uid, "name": document.name})
        else:
            docs.append({"_id": document.uid, "name": document.name})

    return docs, app_settings


def import_package(
    path, collection: str, root_package_uid: str = None, contained: bool = True, is_root: bool = False
) -> Union[Package, Dict]:
    package_type = DMT.PACKAGE.value if collection == Config.BLUEPRINT_COLLECTION else DMT.ENTITY_PACKAGE.value
    package = Package(
        name=os.path.basename(path),
        type=package_type,
        uid=str(uuid4()) if not contained else root_package_uid,
        is_root=is_root,
    )

    package.documents, package.applications = _add_documents(
        path, documents=next(os.walk(path))[2], collection=collection
    )
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
        dmt_db[collection].replace_one({"_id": package.uid}, package.to_dict(), upsert=True)
        logger.info(f"Imported package {package.name}")
        return {"_id": package.uid, "name": package.name}
    else:
        return package

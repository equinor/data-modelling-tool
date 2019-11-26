import json
import os
from typing import Dict, List, Union

from utils.helper_functions import schemas_location

from core.repository.file.document_repository import TemplateRepositoryFromFile

from core.domain.schema import Factory

from core.domain.dto import DTO
from core.domain.models import Package, Blueprint
from services.database import dmt_database as dmt_db
from core.enums import DMT, SIMOS
from utils.logging import logger


def _add_documents(path, documents, collection) -> List[Dict]:
    template_repository = TemplateRepositoryFromFile(schemas_location())
    factory = Factory(template_repository, read_from_file=True)
    docs = []
    for file in documents:
        logger.info(f"Working on {file}...")
        with open(f"{path}/{file}") as json_file:
            data = json.load(json_file)
        if data["type"] == SIMOS.BLUEPRINT.value:
            document = DTO(Blueprint.from_dict(data))
        else:
            Entity = factory.create(data["type"])
            document = DTO(Entity.from_dict(data))
        dmt_db[collection].replace_one({"_id": document.uid}, document.data.to_dict(), upsert=True)
        docs.append({"_id": document.uid, "name": document.name, "type": document.type})
    return docs


def import_package(path, collection: str, is_root: bool = False) -> Union[Package, Dict]:
    package = Package(name=os.path.basename(path), type=DMT.PACKAGE.value, is_root=is_root)
    files = []
    directories = []
    for (path, directory, file) in os.walk(path):
        directories.extend(directory)
        files.extend(file)
        break

    package.content = _add_documents(path, documents=files, collection=collection)
    for folder in directories:
        package.content.append(import_package(f"{path}/{folder}", is_root=False, collection=collection))

    package = DTO(package)
    dmt_db[collection].replace_one({"_id": package.uid}, package.data.to_dict(include_defaults=False), upsert=True)
    logger.info(f"Imported package {package.name}")
    return {"_id": package.uid, "name": package.name, "type": package.type}

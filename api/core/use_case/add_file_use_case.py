from typing import Dict
from uuid import uuid4

from classes.data_source import DataSource
from core.domain.dto import DTO
from core.domain.storage_recipe import StorageRecipe
from core.repository.interface.document_repository import DocumentRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint
from utils.logging import logger


class AddFileRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, name=None, type=None, attribute=None, path=None, data=None):
        self.parent_id = parent_id
        self.name = name
        self.type = type
        self.attribute = attribute
        self.path = path
        self.data = data

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if "name" not in adict:
            invalid_req.add_error("name", "is missing")

        if "type" not in adict:
            invalid_req.add_error("type", "is missing")

        if "attribute" not in adict:
            invalid_req.add_error("attribute", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(
            parent_id=adict.get("parentId"),
            name=adict.get("name"),
            type=adict.get("type"),
            attribute=adict.get("attribute"),
            path=adict.get("path", ""),
            data=adict.get("data", None),
        )


class AddFileUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository, get_repository, data_source: DataSource):
        self.document_repository = document_repository
        self.get_repository = get_repository
        self.data_source = data_source

    def process_request(self, request_object: AddFileRequestObject):
        parent_id: str = request_object.parent_id
        name: str = request_object.name
        type: str = request_object.type
        attribute: str = request_object.attribute
        data: Dict = request_object.data

        parent: DTO = self.document_repository.get(parent_id)
        if not parent:
            raise EntityNotFoundException(uid=parent_id)

        parent_data = parent.data
        if attribute not in parent_data:
            parent_data[attribute] = []

        blueprint = get_blueprint(parent.type)
        if not blueprint:
            raise EntityNotFoundException(uid=parent.type)

        storage_recipe: StorageRecipe = get_storage_recipe(blueprint)

        # TODO: Set all data
        file = DTO(uid=uuid4(), data={"name": name, "description": "", "type": type})

        if storage_recipe.is_contained(attribute, type):
            parent_data[attribute] += [data]
        else:
            parent_data[attribute] += [{"_id": file.uid, "name": name}]
            self.document_repository.add(file)
            logger.info(f"Added document '{file.uid}''")

        self.document_repository.update(parent)

        return res.ResponseSuccess(file)

from typing import Dict

from core.domain.dto import DTO
from core.domain.storage_recipe import StorageRecipe
from core.enums import SIMOS, DMT
from core.repository.interface.document_repository import DocumentRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint
from utils.data_structure.find import get
from utils.logging import logger


def get_required_attributes(type: str):
    return [
        {"type": "string", "name": "name"},
        {"type": "string", "name": "description"},
        # TODO: Set the default type of the entity
        {"type": "string", "name": "type", "default": type},
    ]


class AddFileRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, name=None, description=None, type=None, attribute=None, path=None, data=None):
        self.parent_id = parent_id
        self.name = name
        self.description = description
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
            description=adict.get("description", ""),
            type=adict.get("type"),
            attribute=adict.get("attribute"),
            path=adict.get("path", ""),
            data=adict.get("data", None),
        )


class AddFileUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object: AddFileRequestObject):
        parent_id: str = request_object.parent_id
        name: str = request_object.name
        type: str = request_object.type
        description: str = request_object.description
        attribute: str = request_object.attribute
        data: Dict = request_object.data

        parent: DTO = self.document_repository.get(parent_id)
        if not parent:
            raise EntityNotFoundException(uid=parent_id)

        parent_data = parent.data

        # Set empty content on package if no content
        if parent.type == DMT.PACKAGE.value:
            parent_data["content"] = parent_data.get("content", [])

        try:
            get(parent_data, attribute)
        except ValueError:
            raise ValueError(f"The attribute '{attribute}' is missing")

        parent_blueprint = get_blueprint(parent.type)
        if not parent_blueprint:
            raise EntityNotFoundException(uid=parent.type)

        storage_recipe: StorageRecipe = get_storage_recipe(parent_blueprint)

        if storage_recipe.is_contained(attribute, type):
            getattr(parent_data, attribute).append(data)
            logger.info(f"Added contained document")
            self.document_repository.update(parent)
            return res.ResponseSuccess(parent)
        else:
            file = DTO(data={"name": name, "description": description, "type": type})
            if type == SIMOS.BLUEPRINT.value:
                file.data["attributes"] = get_required_attributes("NOT_IMPLEMENTED")

            get(parent_data, attribute).append({"_id": file.uid, "name": name, "type": type})
            self.document_repository.add(file)
            logger.info(f"Added document '{file.uid}''")
            self.document_repository.update(parent)
            return res.ResponseSuccess(file)

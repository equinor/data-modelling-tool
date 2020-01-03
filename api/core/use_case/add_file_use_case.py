from typing import Dict

import stringcase
from dotted.collection import DottedDict

from classes.dto import DTO
from classes.storage_recipe import StorageRecipe
from core.enums import DMT, SIMOS
from core.repository import Repository
from core.repository.repository_exceptions import EntityNotFoundException
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.use_case.utils.create_entity import CreateEntity
from core.use_case.utils.get_blueprint import get_blueprint
from utils.data_structure.find import get
from utils.logging import logger


def get_required_attributes(type: str):
    return [
        {"type": "string", "name": "name"},
        {"type": "string", "name": "description"},
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


class BlueprintProvider:
    def __init__(self, document_repository):
        self.document_repository = document_repository

    def get_blueprint(self, type: str):
        return get_blueprint(type)


class AddFileUseCase(uc.UseCase):
    def __init__(self, document_repository: Repository):
        self.document_repository = document_repository
        self.blueprint_provider = BlueprintProvider(document_repository=self.document_repository)

    def process_request(self, request_object: AddFileRequestObject):
        parent_id: str = request_object.parent_id
        name: str = request_object.name
        type: str = request_object.type
        description: str = request_object.description
        attribute: str = stringcase.snakecase(request_object.attribute)

        attribute_dot_path = request_object.attribute

        parent: DTO = self.document_repository.get(parent_id)
        if not parent:
            raise EntityNotFoundException(uid=parent_id)

        entity: Dict = CreateEntity(self.blueprint_provider, name=name, type=type, description=description).entity

        parent_data = parent.data

        # Set empty content on package if no content
        if parent.type == DMT.PACKAGE.value:
            parent_data["content"] = parent_data.get("content", [])

        try:
            dotted_data = DottedDict(parent_data)
            try:
                dotted_data[attribute_dot_path]
            except KeyError:
                get(parent_data, attribute_dot_path)
        except ValueError:
            raise ValueError(f"The attribute '{attribute}' is missing")

        parent_blueprint = get_blueprint(parent.type)
        if not parent_blueprint:
            raise EntityNotFoundException(uid=parent.type)

        storage_recipe: StorageRecipe = parent_blueprint.storage_recipes[0]

        if storage_recipe.is_contained(attribute, type):
            # only array types can be added from context menu.
            # single types in tree can only be clicked.
            if isinstance(parent_data, dict):
                try:
                    dotted_data[attribute_dot_path].append(entity)
                    parent.data = dotted_data.to_python()
                    self.document_repository.update(parent)
                except KeyError:
                    pass

            else:
                getattr(parent_data, attribute).append(entity)
                logger.info(f"Added contained document")
                self.document_repository.update(parent)
            return res.ResponseSuccess(parent)
        else:
            file = DTO(data=entity)
            if type == SIMOS.BLUEPRINT.value:
                file.data["attributes"] = get_required_attributes(type=type)
            get(parent_data, attribute).append({"_id": file.uid, "name": name, "type": type})
            self.document_repository.add(file)
            logger.info(f"Added document '{file.uid}''")
            self.document_repository.update(parent)
            return res.ResponseSuccess(file)

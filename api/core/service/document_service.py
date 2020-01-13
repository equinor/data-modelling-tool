from typing import Dict
from uuid import UUID

import stringcase
from dotted.collection import DottedDict

from classes.dto import DTO
from core.repository import Repository
from core.repository.repository_exceptions import EntityNotFoundException
from core.use_case.utils.get_document_children import get_document_children
from core.use_case.utils.get_blueprint import get_blueprint
from utils.logging import logger
from utils.data_structure.find import get

# TODO: Have this return a DTO? We are going DTO->Dict->DTO now
from core.use_case.utils.create_entity import CreateEntity

from classes.storage_recipe import StorageRecipe


def get_complete_document(document_uid: UUID, document_repository: Repository) -> Dict:
    document: DTO = document_repository.get(str(document_uid))
    if not document:
        raise EntityNotFoundException(uid=document_uid)

    blueprint = get_blueprint(document.type)
    result = document.data

    for attribute in blueprint.attributes:
        attribute_name = attribute.name
        key = attribute_name
        if attribute_name in result:
            if blueprint.storage_recipes[0].is_contained(attribute_name, attribute.type):
                pass
            else:
                if attribute.dimensions == "*":
                    items = result[attribute_name]
                    documents = [get_complete_document(item["_id"], document_repository) for item in items]
                    result[key] = documents
                else:
                    result[key] = get_complete_document(result[attribute_name]["_id"], document_repository)

    return result


def remove_children(document: DTO, document_repository: Repository):
    children = get_document_children(document, document_repository)
    for child in children:
        document_repository.delete(child.uid)
        logger.info(f"Removed child document '{child.uid}'")


class DocumentService:
    @staticmethod
    def get_by_uid(document_uid: UUID, document_repository: Repository) -> DTO:
        adict = get_complete_document(document_uid, document_repository)
        return DTO(data=adict, uid=document_uid)

    @staticmethod
    def remove_attribute(parent: DTO, attribute: str, document_repository: Repository):
        dotted_data = DottedDict(parent.data)
        attribute_document = dotted_data[attribute]

        path = attribute.split(".")
        if len(path) > 1:
            path.pop()
            instance = dotted_data["".join(path)].to_python()
            if isinstance(instance, list):
                del dotted_data[attribute]
            else:
                dotted_data[attribute] = {}
        else:
            dotted_data[attribute] = {}

        document_repository.update(DTO(dotted_data.to_python(), uid=parent.uid))
        remove_children(DTO(attribute_document), document_repository)
        logger.info(f"Removed attribute '{attribute}' from '{parent.uid}'")

    @staticmethod
    def rename_attribute(parent_id: str, attribute: str, name: str, document_repository: Repository):
        parent: DTO = document_repository.get(parent_id)
        if not parent:
            raise EntityNotFoundException(uid=parent_id)

        dotted_data = DottedDict(parent.data)
        attribute_document = dotted_data[attribute]
        attribute_document["name"] = name
        dotted_data[attribute] = attribute_document
        document = DTO(dotted_data.to_python(), uid=parent.uid)
        document_repository.update(document)
        logger.info(f"Rename attribute '{attribute}' from '{parent.uid}'")
        return document

    @staticmethod
    def add_document(
        parent_id: str,
        type: str,
        name: str,
        description: str,
        attribute_dot_path: str,
        document_repository: Repository,
    ):
        attribute = stringcase.snakecase(attribute_dot_path)

        parent: DTO = document_repository.get(parent_id)
        if not parent:
            raise EntityNotFoundException(uid=parent_id)

        class BlueprintProvider:
            def get_blueprint(self, type: str):
                return get_blueprint(type)

        blueprint_provider = BlueprintProvider()

        entity: Dict = CreateEntity(blueprint_provider, name=name, type=type, description=description).entity

        parent_data = parent.data

        parent_blueprint = get_blueprint(parent.type)
        if not parent_blueprint:
            raise EntityNotFoundException(uid=parent.type)

        storage_recipe: StorageRecipe = parent_blueprint.storage_recipes[0]

        if storage_recipe.is_contained(attribute, type):
            # only array types can be added from context menu.
            # single types in tree can only be clicked.
            if isinstance(parent_data, dict):
                try:
                    dotted_data = DottedDict(parent_data)
                    dotted_data[attribute_dot_path].append(entity)
                    parent.data = dotted_data.to_python()
                except KeyError:
                    raise ValueError(f"The attribute '{attribute}' is missing")
            else:
                getattr(parent_data, attribute).append(entity)
                logger.info(f"Added contained document")

            return document_repository.update(parent)
        else:
            document = DTO(data=entity)
            get(parent_data, attribute).append({"_id": document.uid, "name": name, "type": type})
            document_repository.add(document)
            logger.info(f"Added document '{document.uid}''")
            document_repository.update(parent)
            return document

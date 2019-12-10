from typing import Dict
from uuid import UUID
from dotted.collection import DottedDict
from stringcase import snakecase, camelcase
from core.domain.dynamic_models import StorageRecipe
from core.domain.dto import DTO
from core.repository.interface.document_repository import DocumentRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.use_case.utils.get_document_children import get_document_children
from core.use_case.utils.get_data_always_as_dict import get_data_always_as_dict
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint
from utils.logging import logger


def get_complete_document(document_uid: UUID, document_repository: DocumentRepository) -> Dict:
    document: DTO = document_repository.get(str(document_uid))
    if not document:
        raise EntityNotFoundException(uid=document_uid)

    blueprint = get_blueprint(document.type)

    if not isinstance(document.data, dict):
        data = document.data.to_dict(include_defaults=True)
    else:
        data = document.data

    result = data

    storage_recipe: StorageRecipe = get_storage_recipe(blueprint)

    for attribute in blueprint.attributes:
        attribute_name = snakecase(attribute.name)
        key = camelcase(attribute_name)
        attribute_type = attribute.type
        if attribute_name in data:
            if storage_recipe.is_contained(attribute_name, attribute_type):
                result[key] = data[attribute_name]
            else:
                if attribute.dimensions == "*":
                    items = data[attribute_name]
                    documents = [get_complete_document(item["_id"], document_repository) for item in items]
                    result[key] = documents
                else:
                    result[key] = get_complete_document(data[attribute_name]["_id"], document_repository)

    return result


def remove_children(document: DTO, document_repository: DocumentRepository):
    children = get_document_children(document, document_repository)
    for child in children:
        document_repository.delete(DTO(uid=child.uid, data={}))
        logger.info(f"Removed child document '{child.uid}'")


class DocumentService:
    @staticmethod
    def get_by_uid(document_uid: UUID, document_repository: DocumentRepository) -> DTO:
        adict = get_complete_document(document_uid, document_repository)
        return DTO(data=adict, uid=document_uid)

    @staticmethod
    def remove_attribute(parent: DTO, attribute: str, document_repository: DocumentRepository):
        parent = get_data_always_as_dict(parent)
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
    def rename_attribute(parent_id: str, attribute: str, name: str, document_repository: DocumentRepository):
        parent: DTO = document_repository.get(parent_id)
        if not parent:
            raise EntityNotFoundException(uid=parent_id)

        parent = get_data_always_as_dict(parent)
        dotted_data = DottedDict(parent.data)
        attribute_document = dotted_data[attribute]
        attribute_document["name"] = name
        dotted_data[attribute] = attribute_document
        document = DTO(dotted_data.to_python(), uid=parent.uid)
        document_repository.update(document)
        logger.info(f"Rename attribute '{attribute}' from '{parent.uid}'")
        return document

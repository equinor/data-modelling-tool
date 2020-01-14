from typing import Dict

from dotted.collection import DottedDict

from classes.dto import DTO
from classes.tree_node import Node
from core.repository import Repository
from core.repository.repository_exceptions import EntityNotFoundException, EntityAlreadyExistsException
from core.use_case.utils.get_document_children import get_document_children
from core.utility import get_blueprint
from utils.logging import logger

# TODO: Have this return a DTO? We are going DTO->Dict->DTO now
def get_complete_document(document_uid: str, document_repository: Repository) -> Dict:
    document: DTO = document_repository.get(document_uid)
from classes.storage_recipe import StorageRecipe


def create_reference(data: Dict, document_repository, type: str):
    data["type"] = type
    file = DTO(data)
    document_repository.add(file)
    return {"_id": file.uid, "name": file.data.get("name", ""), "type": type}


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
            if blueprint.storage_recipes[0].is_contained(attribute_name, attribute.attribute_type):
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
    def get_by_uid(document_uid: str, document_repository: Repository) -> DTO:
        adict = get_complete_document(document_uid, document_repository)
        # node = Node(DTO(data=adict, uid=document_uid))
        return DTO(data=adict, uid=document_uid)

    @staticmethod
    def get_by_uid_return_tree_node(document_uid: str, document_repository: Repository) -> Node:
        adict = get_complete_document(document_uid, document_repository)
        node = Node(DTO(data=adict, uid=document_uid))
        return node

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

    def rename_document(
        self, document_id: str, parent_id: str, name: str, attribute: str, document_repository: Repository
    ):
        document: DTO = document_repository.get(document_id)
        if not document:
            raise EntityNotFoundException(document_id)

        if parent_id:
            parent_document: DTO = document_repository.get(parent_id)
            if not parent_document:
                raise EntityNotFoundException(parent_id)

            references = list(filter(lambda x: x["name"] == name, parent_document[attribute]))
            if len(references) > 0:
                raise EntityAlreadyExistsException(name)

            # Remove old reference
            parent_document[attribute] = [ref for ref in parent_document["content"] if not ref["_id"] == document.uid]
            # Add new reference
            reference = {"_id": document.uid, "name": name, "type": document.type}
            parent_document[attribute].append(reference)

        document.name = name
        document_repository.update(document)

        logger.info(f"Rename document '{document.uid}' to '{name}")

        return document

    def update_document(self, document_id: str, data: dict, attribute: str, document_repository: Repository):
        def update_attribute(attribute, data: Dict, storage_recipe: StorageRecipe, document_repository):
            is_contained_in_storage = storage_recipe.is_contained(attribute.name, attribute.type)
            attribute_data = data[attribute.name]

            if is_contained_in_storage:
                return attribute_data
            else:
                if attribute.dimensions == "*":
                    references = []
                    for instance in attribute_data:
                        reference = create_reference(instance, document_repository, attribute.type)
                        update_document(reference["_id"], instance, document_repository)
                        references.append(reference)
                    return references
                else:
                    reference = create_reference(attribute_data, document_repository, attribute.type)
                    return reference

        def update_document(document_id, data: Dict, document_repository: Repository) -> DTO:
            document: DTO = document_repository.get(document_id)

            if not document:
                raise EntityNotFoundException(uid=document_id)

            blueprint = get_blueprint(document.type)
            if not blueprint:
                raise EntityNotFoundException(uid=document.type)

            for key in data.keys():
                # TODO: Sure we want this filter?
                attribute = next((x for x in blueprint.attributes if x.name == key), None)
                if not attribute:
                    logger.error(f"Could not find attribute {key} in {document.uid}")
                else:
                    document[key] = update_attribute(
                        attribute, data, blueprint.storage_recipes[0], document_repository
                    )

            return document

        if attribute:
            existing_data: DTO = document_repository.get(document_id).data
            if not existing_data:
                raise EntityNotFoundException(uid=document_id)
            existing_data[attribute] = data
            data = existing_data

        document = update_document(document_id, data, document_repository)

        document_repository.update(document)

        logger.info(f"Updated document '{document.uid}''")

        return document

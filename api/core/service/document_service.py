from pyclbr import Function
from typing import Dict, List

import stringcase
from core.enums import DMT, SIMOS
from core.repository import Repository
from core.repository.repository_exceptions import EntityAlreadyExistsException, EntityNotFoundException
from core.use_case.utils.create_entity import CreateEntity
from core.utility import get_blueprint
from dotted.collection import DottedDict
from utils.data_structure.find import get
from utils.logging import logger

from classes.blueprint import Blueprint
from classes.blueprint_attribute import BlueprintAttribute
from classes.dto import DTO
from classes.storage_recipe import StorageRecipe
from classes.tree_node import Node


def create_reference(data: Dict, document_repository, type: str):
    data["type"] = type
    file = DTO(data)
    document_repository.add(file)
    return {"_id": file.uid, "name": file.data.get("name", ""), "type": type}


def get_document(document_uid: str, document_repository: Repository):
    document: DTO = document_repository.get(str(document_uid))

    if not document:
        raise EntityNotFoundException(uid=document_uid)

    return document


def get_resolved_document(document: DTO, document_repository: Repository, blueprint_provider: Function) -> Dict:
    blueprint: Blueprint = blueprint_provider(document.type)

    data: Dict = document.data
    data["_blueprint"] = blueprint.to_dict()

    for complex_attribute in blueprint.get_none_primitive_types():
        attribute_name = complex_attribute.name
        if attribute_name in data and data[attribute_name] is not None:
            storage_recipe: StorageRecipe = blueprint.storage_recipes[0]
            if storage_recipe.is_contained(attribute_name, complex_attribute.attribute_type):
                if complex_attribute.is_array():
                    document.data[attribute_name] = [
                        get_resolved_document(DTO(item), document_repository, blueprint_provider)
                        for item in data[attribute_name]
                    ]
                else:
                    data[attribute_name] = get_resolved_document(
                        DTO(document.data[attribute_name]), document_repository, blueprint_provider
                    )
            else:
                if complex_attribute.is_array():
                    data[attribute_name] = [
                        get_complete_document(item["_id"], document_repository, blueprint_provider)
                        for item in data[attribute_name]
                    ]
                else:
                    data[attribute_name] = get_complete_document(
                        data[attribute_name]["_id"], document_repository, blueprint_provider
                    )

    return data


def get_complete_document(
    document_uid: str, document_repository: Repository, blueprint_provider: Function = get_blueprint
) -> Dict:
    document = get_document(document_uid=document_uid, document_repository=document_repository)

    temp = get_resolved_document(document, document_repository, blueprint_provider)
    return temp


class DocumentService:
    def __init__(self, repository_provider, blueprint_provider=get_blueprint):
        self.blueprint_provider = blueprint_provider
        self.repository_provider = repository_provider

    def get_by_uid(self, data_source_id: str, document_uid: str) -> Node:
        node = Node.from_dict(
            DTO(get_complete_document(document_uid, self.repository_provider(data_source_id), self.blueprint_provider))
        )
        return node

    def get_root_packages(self, data_source_id: str):
        return self.repository_provider(data_source_id).find(
            {"type": "system/DMT/Package", "isRoot": True}, single=False
        )

    def rename_attribute(self, data_source_id: str, parent_id: str, attribute: List[str], name: str):
        node: Node = self.get_by_uid(data_source_id=data_source_id, document_uid=parent_id)
        attribute_node_id = f"{parent_id}.{attribute}"
        attribute_node = node.search(attribute_node_id)
        attribute_node.update({"name": name})
        node.replace(attribute_node_id, attribute_node)
        document = DTO(node.to_dict())
        self.repository_provider(data_source_id).update(document)
        logger.info(f"Rename attribute '{attribute}' from '{node.node_id}'")
        return document

    def remove_document(self, data_source_id: str, document_id: str, parent_id: str = None):
        if parent_id:
            parent: Node = self.get_by_uid(data_source_id, parent_id)

            if not parent:
                raise EntityNotFoundException(uid=parent_id)

            attribute_node = parent.search(document_id)

            if not attribute_node:
                raise EntityNotFoundException(uid=document_id)

            if attribute_node.has_uid():
                self._remove_document(data_source_id, document_id)

            attribute_node.remove()

            self.repository_provider(data_source_id).update(DTO(parent.to_dict()))
        else:
            self._remove_document(data_source_id, document_id)

    def _remove_document(self, data_source_id, document_id):
        document: Node = self.get_by_uid(data_source_id, document_id)
        if not document:
            raise EntityNotFoundException(uid=document_id)

        # Remove the actual document
        self.repository_provider(data_source_id).delete(document.node_id)
        logger.info(f"Removed document '{document.node_id}'")

        # Remove child references
        for child in document.traverse():
            if child.has_uid():
                self.repository_provider(data_source_id).delete(child.uid)
                logger.info(f"Removed child '{child.uid}'")

    def rename_document(self, data_source_id: str, document_id: str, parent_id: str, name: str, attribute: str):
        document: DTO = self.repository_provider(data_source_id).get(document_id)
        if not document:
            raise EntityNotFoundException(document_id)

        if parent_id:
            parent_document: DTO = self.repository_provider(data_source_id).get(parent_id)
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
        self.repository_provider(data_source_id).update(document)

        logger.info(f"Rename document '{document.uid}' to '{name}")

        return document

    def update_document(self, data_source_id: str, document_id: str, data: dict, attribute: str):
        def update_attribute(attribute, data: BlueprintAttribute, storage_recipe: StorageRecipe, document_repository):
            is_contained_in_storage = storage_recipe.is_contained(attribute.name, attribute.attribute_type)
            attribute_data = data[attribute.name]

            if is_contained_in_storage:
                return attribute_data
            else:
                if attribute.dimensions == "*":
                    references = []
                    for instance in attribute_data:
                        reference = create_reference(instance, document_repository, attribute.attribute_type)
                        update_document(reference["_id"], instance, document_repository)
                        references.append(reference)
                    return references
                else:
                    reference = create_reference(attribute_data, document_repository, attribute.attribute_type)
                    return reference

        def update_document(document_id, data: Dict, document_repository: Repository) -> DTO:
            document: DTO = document_repository.get(uid=document_id)

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
            existing_data: DTO = self.repository_provider(data_source_id).get(document_id).data
            if not existing_data:
                raise EntityNotFoundException(uid=document_id)
            dotted_data = DottedDict(existing_data)
            dotted_data[attribute] = data
            data = dotted_data.to_python()

        document = update_document(document_id, data, self.repository_provider(data_source_id))

        self.repository_provider(data_source_id).update(document)

        logger.info(f"Updated document '{document.uid}''")

        return document

    def add_document(
        self, data_source_id: str, parent_id: str, type: str, name: str, description: str, attribute_dot_path: str
    ):
        attribute: str = stringcase.snakecase(attribute_dot_path)

        parent: DTO = self.repository_provider(data_source_id).get(parent_id)
        if not parent:
            raise EntityNotFoundException(uid=parent_id)

        class BlueprintProvider:
            def get_blueprint(self, type: str):
                return get_blueprint(type)

        blueprint_provider = BlueprintProvider()

        entity: Dict = CreateEntity(blueprint_provider, name=name, type=type, description=description).entity

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
                except KeyError:
                    pass

            else:
                getattr(parent_data, attribute).append(entity)
                logger.info(f"Added contained document")
            self.repository_provider(data_source_id).update(parent)
            new_id = f"{parent_id}.{attribute_dot_path}.{len(dotted_data[attribute_dot_path]) - 1}"
            return {"uid": new_id}
        else:

            def get_required_attributes(type: str):
                return [
                    {"type": "system/SIMOS/BlueprintAttribute", "attributeType": "string", "name": "name"},
                    {"type": "system/SIMOS/BlueprintAttribute", "attributeType": "string", "name": "description"},
                    {
                        "type": "system/SIMOS/BlueprintAttribute",
                        "attributeType": "string",
                        "name": "type",
                        "default": type,
                    },
                ]

            file = DTO(data=entity)
            if type == SIMOS.BLUEPRINT.value:
                file.data["attributes"] = get_required_attributes(type=type)
            get(parent_data, attribute).append({"_id": file.uid, "name": name, "type": type})
            self.repository_provider(data_source_id).add(file)
            logger.info(f"Added document '{file.uid}''")
            self.repository_provider(data_source_id).update(parent)
            return file

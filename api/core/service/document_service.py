from pyclbr import Function
from typing import Dict

import stringcase
from utils.data_structure.dot_notation import to_dot_notation

from classes.blueprint import Blueprint
from dotted.collection import DottedDict

from classes.blueprint_attribute import BlueprintAttribute
from classes.dto import DTO
from classes.storage_recipe import StorageRecipe
from classes.tree_node import Node
from core.repository import Repository
from core.repository.repository_exceptions import EntityNotFoundException, EntityAlreadyExistsException
from core.use_case.utils.get_document_children import get_document_children
from core.utility import get_blueprint
from utils.logging import logger

from core.use_case.utils.create_entity import CreateEntity

from core.enums import DMT, SIMOS
from utils.data_structure.find import get


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


def traverse(
        document: DTO,
        document_repository: Repository,
        blueprint_provider: Function,
        callback: Function,
        path=None,
) -> Dict:
    if path is None:
        path = []

    blueprint: Blueprint = blueprint_provider(document.type)

    data: Dict = document.data

    for complex_attribute in blueprint.get_none_primitive_types():
        attribute_name = complex_attribute.name
        if attribute_name in data and data[attribute_name]:
            storage_recipe: StorageRecipe = blueprint.storage_recipes[0]
            if storage_recipe.is_contained(attribute_name, complex_attribute.attribute_type):
                if complex_attribute.is_array():
                    for i, item in enumerate(data[attribute_name]):
                        traverse(DTO(item), document_repository, blueprint_provider, callback,
                                 path + [attribute_name, str(i)])

                else:
                    traverse(
                        DTO(document.data[attribute_name]), document_repository, blueprint_provider, callback,
                        path + [attribute_name]
                    )
            else:
                if complex_attribute.is_array():
                    for i, item in enumerate(data[attribute_name]):
                        traverse(get_document(item["_id"], document_repository), blueprint_provider, callback,
                                 path + [attribute_name, str(i)])

                else:
                    traverse(get_document(
                        data[attribute_name]["_id"], document_repository), blueprint_provider, callback,
                        path + [attribute_name]
                    )

    return callback(document, blueprint, path)


def get_complete_document(
        document_uid: str, document_repository: Repository, blueprint_provider: Function = get_blueprint
) -> Dict:
    document = get_document(document_uid=document_uid, document_repository=document_repository)

    data = DottedDict({})

    def add_data(document, blueprint, path):
        dot_path = str(".".join(path))
        if dot_path:
            data[dot_path] = document.data
        else:
            data.update(document.data)

    blueprints = {}

    def add_blueprint(document, blueprint, path):
        blueprints[document.type] = blueprint

    traverse(document, document_repository, blueprint_provider, add_data)
    traverse(document, document_repository, blueprint_provider, add_blueprint)

    return data.to_python(), blueprints
    temp = get_resolved_document(document, document_repository, blueprint_provider)
    return temp


def remove_children(document: DTO, document_repository: Repository):
    children = get_document_children(document, document_repository)
    for child in children:
        document_repository.delete(child.uid)
        logger.info(f"Removed child document '{child.uid}'")


class DocumentService:
    @staticmethod
    def get_by_uid(document_uid: str, document_repository: Repository) -> DTO:
        data, blueprints = get_complete_document(document_uid, document_repository)
        print(blueprints)
        return DTO(data=data, uid=document_uid)

    @staticmethod
    def get_tree_node_by_uid(document_uid: str, repository: Repository) -> Node:
        adict = get_complete_document(document_uid, repository)
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
                dotted_data[attribute] = None
        else:
            dotted_data[attribute] = None

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

    def remove_document(self, document_id: str, parent_id: str, attribute: str, document_repository: Repository):
        document: DTO = document_repository.get(document_id)
        if not document:
            raise EntityNotFoundException(uid=document_id)

        if parent_id:
            # Remove reference from parent
            parent: DTO = document_repository.get(parent_id)
            if not parent:
                raise EntityNotFoundException(uid=parent_id)

            parent[attribute] = list(filter(lambda d: d["_id"] != document.uid, parent[attribute]))

            document_repository.update(parent)

        # Remove the actual document
        document_repository.delete(document.uid)

        # Remove children of the document
        children = get_document_children(document, document_repository)
        for child in children:
            document_repository.delete(child.uid)
            logger.info(f"Removed child document '{child.uid}'")

        logger.info(f"Removed document '{document.uid}'")

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
            dotted_data = DottedDict(existing_data)
            dotted_data[attribute] = data
            data = dotted_data.to_python()

        document = update_document(document_id, data, document_repository)

        document_repository.update(document)

        logger.info(f"Updated document '{document.uid}''")

        return document

    def add_document(
            self,
            parent_id: str,
            type: str,
            name: str,
            description: str,
            attribute_dot_path: str,
            document_repository: Repository,
    ):
        attribute: str = stringcase.snakecase(attribute_dot_path)

        parent: DTO = document_repository.get(parent_id)
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
            document_repository.update(parent)
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
            document_repository.add(file)
            logger.info(f"Added document '{file.uid}''")
            document_repository.update(parent)
            return file

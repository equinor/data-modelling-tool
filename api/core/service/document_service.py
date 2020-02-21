from typing import Dict, Union
from uuid import uuid4

from classes.blueprint import Blueprint
from classes.dto import DTO
from classes.storage_recipe import StorageRecipe
from classes.tree_node import ListNode, Node
from core.enums import SIMOS
from core.repository import Repository
from core.repository.repository_exceptions import EntityNotFoundException
from core.use_case.utils.create_entity import CreateEntity
from core.utility import BlueprintProvider
from utils.logging import logger


def get_required_attributes(type: str):
    return [
        {"type": "system/SIMOS/BlueprintAttribute", "attributeType": "string", "name": "name"},
        {"type": "system/SIMOS/BlueprintAttribute", "attributeType": "string", "name": "description"},
        {"type": "system/SIMOS/BlueprintAttribute", "attributeType": "string", "name": "type", "default": type},
    ]


def get_document(document_uid: str, document_repository: Repository):
    document: DTO = document_repository.get(str(document_uid))

    if not document:
        raise EntityNotFoundException(uid=document_uid)

    return document


def get_resolved_document(
    document: DTO, document_repository: Repository, blueprint_provider: BlueprintProvider
) -> Dict:
    blueprint: Blueprint = blueprint_provider.get_blueprint(document.type)

    data: Dict = document.data

    for complex_attribute in blueprint.get_none_primitive_types():
        attribute_name = complex_attribute.name
        if complex_data := document.get(attribute_name):
            storage_recipe: StorageRecipe = blueprint.storage_recipes[0]
            if storage_recipe.is_contained(attribute_name, complex_attribute.attribute_type):
                if complex_attribute.is_array():
                    temp = []
                    for item in complex_data:
                        # Only optional, and unfixed array attributes are allowed to have empty{} items.
                        if not item and (complex_attribute.is_optional() or complex_attribute.dimensions.is_unfixed()):
                            temp.append({})
                        else:
                            try:
                                temp.append(get_resolved_document(DTO(item), document_repository, blueprint_provider))
                            except:
                                error = f"The entity {item} is invalid! Type: {complex_attribute.attribute_type}"
                                logger.error(error)
                                raise Exception(error)

                    document.data[attribute_name] = temp
                else:
                    data[attribute_name] = get_resolved_document(
                        DTO(complex_data), document_repository, blueprint_provider
                    )
            else:
                if complex_attribute.is_array():
                    children = []
                    for item in complex_data:
                        try:
                            doc = get_complete_document(item["_id"], document_repository, blueprint_provider)
                            children.append(doc)
                        except Exception as error:
                            logger.exception(error)
                            # todo add error node to children.
                            # children.append(error_node)
                    data[attribute_name] = children
                else:
                    data[attribute_name] = get_complete_document(
                        complex_data["_id"], document_repository, blueprint_provider
                    )
        # If there is no data, and the attribute is NOT optional, raise an exception
        else:
            if not complex_attribute.is_optional():
                error = f"The entity {document.name} is invalid! None-optional type {attribute_name} is missing."
                logger.error(error)

    return data


def get_complete_document(
    document_uid: str, document_repository: Repository, blueprint_provider: BlueprintProvider
) -> Dict:
    document = get_document(document_uid=document_uid, document_repository=document_repository)

    temp = get_resolved_document(document, document_repository, blueprint_provider)
    return temp


class DocumentService:
    def __init__(self, repository_provider, blueprint_provider=BlueprintProvider()):
        self.blueprint_provider = blueprint_provider
        self.repository_provider = repository_provider

    def get_blueprint(self):
        return self.blueprint_provider

    def invalidate_cache(self):
        self.blueprint_provider.invalidate_cache()

    def save(self, node: Union[Node, ListNode], data_source_id: str) -> None:
        # Update none-contained attributes
        for child in node.children:
            # A list node is always contained on parent. Need to check the blueprint
            if child.is_array() and not child.attribute_is_contained():
                [self.save(x, data_source_id) for x in child.children]
            elif child.not_contained():
                self.save(child, data_source_id)
        ref_dict = node.to_ref_dict()
        dto = DTO(ref_dict)
        self.repository_provider(data_source_id).update(dto)

    def get_by_uid(self, data_source_id: str, document_uid: str) -> Node:
        try:
            # document_uid = document_uid + "2" # impose error
            complete_document = get_complete_document(
                document_uid, self.repository_provider(data_source_id), self.blueprint_provider
            )
        except EntityNotFoundException as error:
            # this is an edge case for packages where the reference in a package entity has wrong document id.
            # the code caller of this method knows the name and node_type that belongs to the document_uid.
            # Thus, the caller code should create the Node and add error information to that node.
            logger.exception(error)
            raise EntityNotFoundException(document_uid)

        return Node.from_dict(
            complete_document, complete_document.get("_id"), blueprint_provider=self.blueprint_provider
        )

    def get_root_packages(self, data_source_id: str):
        return self.repository_provider(data_source_id).find(
            {"type": "system/DMT/Package", "isRoot": True}, single=False
        )

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

            self.save(parent, data_source_id)

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
            # Only remove children if they ARE contained in model and NOT contained in storage
            if child.has_uid() and child.attribute.contained:
                self.repository_provider(data_source_id).delete(child.uid)
                logger.info(f"Removed child '{child.uid}'")

    def rename_document(self, data_source_id: str, document_id: str, name: str, parent_uid: str = None):
        # Only root-packages have no parent_id
        if not parent_uid:
            root_node: Node = self.get_by_uid(data_source_id, document_id)
            target_node = root_node

        # Grab the parent, and set target based on dotted document_id
        else:
            root_node: Node = self.get_by_uid(data_source_id, parent_uid)
            target_node = root_node.search(document_id)

            if not target_node:
                raise EntityNotFoundException(uid=document_id)

        target_node.entity["name"] = name
        self.save(root_node, data_source_id)

        logger.info(f"Rename document '{target_node.node_id}' to '{name}")

        return {"uid": target_node.node_id}

    def update_document(self, data_source_id: str, document_id: str, data: dict, attribute_path: str = None):
        root: Node = self.get_by_uid(data_source_id, document_id)
        if not root:
            raise EntityNotFoundException(uid=document_id)

        target_node = root

        # If it's a contained nested node, set the modify target based on dotted-path
        if attribute_path:
            target_node = root.search(f"{document_id}.{attribute_path}")

        target_node.update(data)
        self.save(root, data_source_id)

        logger.info(f"Updated document '{target_node.node_id}''")

        return {"data": target_node.to_dict()}

    def add_document(
        self, data_source_id: str, parent_id: str, type: str, name: str, description: str, attribute_path: str
    ):
        # We can only add documents to lists. The only exception to this is root_packages, which has their own function
        root: Node = self.get_by_uid(data_source_id, parent_id)
        if not root:
            raise EntityNotFoundException(uid=parent_id)
        parent = root.search(f"{parent_id}.{attribute_path}")

        entity: Dict = CreateEntity(self.blueprint_provider, name=name, type=type, description=description).entity

        if type == SIMOS.BLUEPRINT.value:
            entity["attributes"] = get_required_attributes(type=type)

        new_node_id = str(uuid4()) if not parent.attribute_is_contained() else ""

        new_node = Node.from_dict(entity, new_node_id, self.blueprint_provider)

        new_node.key = str(len(parent.children)) if parent.is_array() else ""

        parent.add_child(new_node)
        self.save(root, data_source_id)

        return {"uid": new_node.node_id}

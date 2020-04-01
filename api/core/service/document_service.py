import io
import zipfile
from typing import Dict, Union
from uuid import uuid4

from classes.blueprint import Blueprint
from classes.dto import DTO
from classes.storage_recipe import StorageRecipe
from classes.tree_node import ListNode, Node
from core.enums import SIMOS, DMT
from core.repository import Repository
from core.repository.repository_exceptions import (
    EntityNotFoundException,
    FileNotFoundException,
    DuplicateFileNameInPackageException,
    InvalidDocumentNameException,
)
from core.repository.zip_file import ZipFileClient
from core.use_case.utils.create_entity import CreateEntity
from core.utility import BlueprintProvider, duplicate_filename, url_safe_name
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
        # If there is no data, and the attribute is NOT optional AND not an array, raise an exception
        else:
            if not complex_attribute.is_optional() and not complex_attribute.is_array():
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

    def save(self, node: Union[Node, ListNode], data_source_id: str, repository=None, path="") -> None:
        # If not passed a custom repository to save into, use the DocumentService's repository
        if not repository:
            repository = self.repository_provider(data_source_id)
        # Update none-contained attributes
        for child in node.children:
            # A list node is always contained on parent. Need to check the blueprint
            if child.is_array() and not child.attribute_is_contained():
                # If the node is a package, we build the path string to be used by "export zip"-repository
                if node.type == DMT.PACKAGE.value:
                    path = f"{path}/{node.name}/" if path else f"{node.name}"
                [self.save(x, data_source_id, repository, path) for x in child.children]
            elif child.not_contained():
                self.save(child, data_source_id, repository, path)
        ref_dict = node.to_ref_dict()
        dto = DTO(ref_dict)
        # Expand this when adding new repositories requiring PATH
        if isinstance(repository, ZipFileClient):
            dto.data["__path__"] = path
        repository.update(dto)

    def get_by_uid(self, data_source_id: str, document_uid: str) -> Node:
        try:
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

    def create_zip_export(self, data_source_id: str, document_uid: str) -> io.BytesIO:
        try:
            complete_document = get_complete_document(
                document_uid, self.repository_provider(data_source_id), self.blueprint_provider
            )
        except EntityNotFoundException as error:
            logger.exception(error)
            raise EntityNotFoundException(document_uid)

        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, mode="w") as zip_file:
            root_node: Node = Node.from_dict(
                complete_document, complete_document.get("_id"), blueprint_provider=self.blueprint_provider
            )
            # Save the selected node, using custom ZipFile repository
            self.save(root_node, data_source_id, ZipFileClient(zip_file))

        memory_file.seek(0)
        return memory_file

    def get_by_path(self, data_source_id: str, path: str):
        ref_elements = path.split("/", 1)
        package_name = ref_elements[0]

        package: DTO = self.repository_provider(data_source_id).find(
            {"type": "system/DMT/Package", "isRoot": True, "name": package_name}, single=True
        )
        if not package:
            raise FileNotFoundException(data_source_id, package_name, is_root=True)

        complete_document = get_complete_document(
            package.uid, self.repository_provider(data_source_id), self.blueprint_provider
        )

        dto = DTO(complete_document)
        node = Node.from_dict(dto.data, dto.uid, blueprint_provider=self.blueprint_provider)

        if len(ref_elements) > 1:
            path = ref_elements[1]
            return node.get_by_name_path(path.split("/"))
        else:
            return node

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
        if not url_safe_name(name):
            raise InvalidDocumentNameException(name)

        root: Node = self.get_by_uid(data_source_id, parent_id)
        if not root:
            raise EntityNotFoundException(uid=parent_id)
        parent = root.get_by_path(attribute_path.split(".")) if attribute_path else root

        # Check if a file/attributre with the same name already exists on the target
        if duplicate_filename(parent, name):
            raise DuplicateFileNameInPackageException(data_source_id, f"{parent.name}/{name}")

        entity: Dict = CreateEntity(self.blueprint_provider, name=name, type=type, description=description).entity

        if type == SIMOS.BLUEPRINT.value:
            entity["attributes"] = get_required_attributes(type=type)

        if isinstance(parent, ListNode):
            new_node_id = str(uuid4()) if not parent.attribute_is_contained() else ""
            new_node = Node.from_dict(entity, new_node_id, self.blueprint_provider)
            new_node.key = str(len(parent.children)) if parent.is_array() else new_node.name
            parent.add_child(new_node)
        # This covers adding a new optional document (not appending to a list)
        else:
            new_node_id = str(uuid4()) if not parent.is_storage_contained() else ""
            new_node = Node.from_dict(entity, new_node_id, self.blueprint_provider)
            new_node.key = attribute_path.split(".")[-1]
            root.replace(parent.node_id, new_node)

        self.save(root, data_source_id)

        return {"uid": new_node.node_id}

    # Add file by parent directory
    def add(self, data_source_id: str, directory: str, document: dict):
        # Convert filesystem path to NodeTree path
        tree_path = "/content/".join(directory.split("/"))
        root: Node = self.get_by_path(data_source_id, tree_path)
        if not root:
            raise EntityNotFoundException(uid=directory)

        name = document["name"]
        type = document["type"]
        description = document["description"]

        if not url_safe_name(name):
            raise InvalidDocumentNameException(name)

        entity: Dict = CreateEntity(self.blueprint_provider, name=name, type=type, description=description).entity

        if type == SIMOS.BLUEPRINT.value:
            entity["attributes"] = get_required_attributes(type=type)

        parent = root.search(f"{root.uid}.content")

        # Check if a file with the same name already exists in the target package
        if duplicate_filename(parent, name):
            raise DuplicateFileNameInPackageException(data_source_id, directory)

        new_node_id = str(uuid4()) if not parent.attribute_is_contained() else ""

        new_node = Node.from_dict(entity, new_node_id, self.blueprint_provider)

        new_node.key = str(len(parent.children)) if parent.is_array() else ""

        parent.add_child(new_node)

        self.save(root, data_source_id)

        return {"uid": new_node.node_id}

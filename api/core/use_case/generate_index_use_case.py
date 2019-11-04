from pathlib import Path
from typing import List, Dict

from anytree import PreOrderIter, RenderTree
from flask import g

from core.domain.blueprint import Blueprint
from core.domain.dto import DTO
from core.domain.entity import Entity
from core.domain.index import DocumentNode
from core.domain.storage_recipe import StorageRecipe
from core.domain.ui_recipe import UIRecipe
from core.enums import DMT, SIMOS
from core.repository.interface.package_repository import PackageRepository
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.use_case.utils.generate_index_menu_actions import (
    get_contained_menu_action,
    get_delete_document_menu_item,
    get_download_menu_action,
    get_dynamic_create_menu_item,
    get_node_on_select,
    get_not_contained_menu_action,
    get_runnable_menu_action,
    get_move_document_menu_item,
    get_create_root_package_menu_item,
)
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint
from core.use_case.utils.get_ui_recipe import get_ui_recipe
from utils.group_by import group_by


def find_attribute_by_title(name: str, attributes: List):
    return next((x for x in attributes if x["title"] == name), None)


class Index:
    def __init__(self, data_source_id: str):
        self.data_source_id = data_source_id
        self.index = {}

    def add(self, adict):
        self.index[adict["id"]] = adict

    def to_dict(self):
        return self.index


def print_tree(root_node):
    for pre, fill, node in RenderTree(root_node):
        treestr = "%s%s" % (pre, node.name)
        print(treestr.ljust(8), node.uid, node.to_node()["nodeType"], node.document.type if node.document else "")


class Tree:
    def __init__(
        self, blueprint_repository: MongoBlueprintRepository, get_repository, package_repository, document_repository
    ):
        self.blueprint_repository = blueprint_repository
        self.get_repository = get_repository
        self.package_repository = package_repository
        self.document_repository = document_repository

    def get_references(self, references, item_type):
        documents = []
        for ref in references:

            if isinstance(ref, dict):
                if item_type == DMT.PACKAGE.value:
                    document = self.package_repository.get(ref["_id"])
                elif item_type == SIMOS.BLUEPRINT.value:
                    document = self.blueprint_repository.get(ref["_id"])
                else:
                    dto = self.document_repository.get(ref["_id"])
                    document = Entity(dto.data)
                    document.uid = dto.uid

                if not document:
                    raise EntityNotFoundException(uid=ref)
                if not hasattr(document, "uid"):
                    document.uid = ref["_id"]
                documents.append(document)

        return documents

    def generate_contained_node(
        self, document_id, document_path, instance, index, data_source_id, attribute_type, parent_node, is_array
    ):
        if is_array:
            uid = f"{document_id}.{'.'.join(document_path)}.{instance['name']}"
            current_path = document_path + [f"{index}"]
        else:
            uid = f"{document_id}.{'.'.join(document_path)}"
            current_path = document_path

        node = DocumentNode(
            data_source_id=data_source_id,
            name=instance["name"],
            document=DTO(Blueprint(name=instance["name"], description="", type=attribute_type), uid=uid),
            blueprint=None,
            parent=parent_node,
            on_select={
                "uid": uid,
                "title": instance["name"],
                "component": "blueprint",
                "data": {
                    "dataUrl": f"/api/v2/documents/{data_source_id}/{document_id}?attribute={'.'.join(current_path)}",
                    "schemaUrl": f"/api/v2/json-schema/{attribute_type}",
                },
            },
            menu_items=[],
            is_contained=True,
        )
        blueprint = get_blueprint(attribute_type)
        ui_recipe: UIRecipe = get_ui_recipe(blueprint, "EDIT")
        for attribute in blueprint.get_attributes_with_reference():
            name = attribute["name"]

            is_contained_in_ui = ui_recipe.is_contained(attribute)
            if is_contained_in_ui:
                continue

            if parent_node.blueprint and blueprint == parent_node.blueprint:
                continue

            self.generate_contained_node(
                document_id,
                current_path + [f"{name}"],
                attribute,
                None,
                data_source_id,
                attribute["type"],
                node,
                False,
            )

    def generate_contained_nodes(
        self, data_source_id, document_id, document_path, attribute_type, values, parent_node
    ):
        for index, instance in enumerate(values):
            if isinstance(instance, dict):
                self.generate_contained_node(
                    document_id, document_path, instance, index, data_source_id, attribute_type, parent_node, True
                )

    def process_document(self, data_source_id, document: DTO, parent_node: DocumentNode, models: List):

        is_package = document.type == DMT.PACKAGE.value
        parent_is_data_source = parent_node.document is None
        attribute_nodes = []

        # Set which attribute on the parent the child belongs in
        if not parent_is_data_source and parent_node.document.type == DMT.PACKAGE.value:
            parent_attribute = "content"
        else:
            parent_attribute = Path(parent_node.start_path).name

        node = DocumentNode(
            data_source_id=data_source_id,
            name=document.name,
            document=document,
            blueprint=get_blueprint(document.type),
            parent=parent_node,
            on_select=get_node_on_select(data_source_id, document),
            menu_items=[],
        )
        if not node.blueprint:
            raise EntityNotFoundException(uid=document.type)

        # Packages should not open a tab on click
        if is_package:
            node.on_select = {}

        # Every node gets an delete and rename action
        node.menu_items.append(
            get_move_document_menu_item(data_source_id, old_path=node.start_path, document=document)
        )
        node.menu_items.append(
            get_delete_document_menu_item(
                data_source_id, parent_id=parent_node.uid, parent_attribute=parent_attribute, document_id=document.uid
            )
        )

        # Runnable entities gets an custom action
        runnable_types = group_by(
            items=g.application_settings["runnableModels"], grouping_function=lambda runnable: runnable["input"]
        )

        if document.type in runnable_types:
            for runnable in runnable_types[document.type]:
                node.menu_items.append(
                    get_runnable_menu_action(
                        data_source_id=data_source_id, document_id=document.uid, runnable=runnable
                    )
                )

        # Applications can be downloaded
        if document.type == SIMOS.APPLICATION.value:
            node.menu_items.append(get_download_menu_action(data_source_id, document.uid))

        storage_recipe: StorageRecipe = get_storage_recipe(node.blueprint)
        ui_recipe: UIRecipe = get_ui_recipe(node.blueprint, "EDIT")

        print(ui_recipe)

        # If the node is a DMT-Package, add "Create New" from AppSettings
        if is_package:
            create_new_menu_items = []
            for model in models:
                model_blueprint = get_blueprint(model)
                create_new_menu_items.append(
                    get_dynamic_create_menu_item(data_source_id, model_blueprint.name, model, document.uid)
                )
            attribute_node = node
            node.menu_items.append({"label": "New", "menuItems": create_new_menu_items})

        # Use the blueprint to find attributes that contains references
        for attribute in node.blueprint.get_attributes_with_reference():
            attribute_name = attribute["name"]
            is_contained_in_storage = storage_recipe.is_contained(attribute["name"], attribute["type"])
            is_contained_in_ui = ui_recipe.is_contained(attribute)

            # Don't create node for ui_contained attributes
            if is_contained_in_ui:
                continue

            print("2", attribute)

            # If the attribute is an array
            # TODO: Handle fixed size arrays
            if attribute.get("dimensions", None) == "*":
                attribute_blueprint = get_blueprint(attribute["type"])

                data = {}
                for item in attribute_blueprint.get_attribute_names():
                    data[item] = ("${" + item + "}",)

                not_contained_menu_action = get_not_contained_menu_action(
                    data_source_id=data_source_id,
                    name=attribute_name,
                    type=attribute["type"],
                    # TODO: Should this be parent_node.id?
                    parent_id=document.uid,
                    data=data,
                )

                contained_menu_action = get_contained_menu_action(
                    data_source_id=data_source_id,
                    name=attribute_name,
                    type=attribute["type"],
                    parent_id=document.uid,
                    data=data,
                )

                # Create a placeholder node that can contain real documents
                if not is_package:
                    attribute_node = DocumentNode(
                        data_source_id=data_source_id,
                        name=attribute_name,
                        document=document,
                        blueprint=node.blueprint,
                        parent=node,
                        menu_items=[contained_menu_action if is_contained_in_storage else not_contained_menu_action],
                        is_contained=True,
                    )

                # Check if values for the attribute exists in current document,
                # this means that we have added some documents to this array.
                values = document.get_values(attribute_name)
                if values:
                    # Values are stored in separate document
                    if not is_contained_in_storage:
                        # Get real documents
                        attribute_nodes.append(
                            {"documents": self.get_references(values, attribute["type"]), "node": attribute_node}
                        )
                    # Values are stored inside parent. We create placeholder nodes.
                    if is_contained_in_storage:
                        self.generate_contained_nodes(
                            data_source_id, document.uid, [attribute_name], attribute["type"], values, attribute_node
                        )
            else:
                values = document.get_values(attribute_name)
                if values:
                    # Values are stored in separate document
                    if not is_contained_in_storage:
                        attribute_nodes.append(
                            {"documents": self.get_references(values, attribute["type"]), "node": node}
                        )
                else:
                    node.menu_items.append(
                        get_dynamic_create_menu_item(
                            data_source_id=data_source_id,
                            name=attribute_name,
                            type=attribute["type"],
                            attribute=attribute_name,
                            parent_id=document.uid,
                        )
                    )

                if is_contained_in_storage:
                    self.generate_contained_node(
                        document.uid, [attribute_name], attribute, None, data_source_id, attribute["type"], node, False
                    )

        for attribute_node in attribute_nodes:
            for attribute_document in attribute_node["documents"]:
                self.process_document(
                    data_source_id=data_source_id,
                    document=attribute_document,
                    parent_node=attribute_node["node"],
                    models=models,
                )

    def execute(self, data_source_id: str, data_source_name: str, packages, document_type: str) -> Index:

        index = Index(data_source_id=data_source_id)

        # Set what Models the user can create on the data_source node and Package nodes
        # TODO: More generic page1, page2, ...
        models = (
            g.application_settings["blueprintsModels"]
            if document_type == "blueprints"
            else g.application_settings["entityModels"]
        )

        # The root-node (data_source) can always create a package
        root_node = DocumentNode(
            data_source_id=data_source_id,
            name=data_source_name,
            menu_items=[{"label": "New", "menuItems": [get_create_root_package_menu_item(data_source_id)]}],
        )

        for package in packages:
            self.process_document(data_source_id, package, root_node, models)

        for node in PreOrderIter(root_node):
            index.add(node.to_node())

        return index


class GenerateIndexUseCase:
    def __init__(
        self,
        blueprint_repository: MongoBlueprintRepository,
        package_repository: PackageRepository,
        get_repository,
        document_repository,
    ):
        self.blueprint_repository = blueprint_repository
        self.package_repository = package_repository
        self.get_repository = get_repository
        self.document_repository = document_repository

        self.tree = Tree(
            blueprint_repository=blueprint_repository,
            package_repository=package_repository,
            get_repository=get_repository,
            document_repository=document_repository,
        )

    def execute(self, data_source_id: str, data_source_name: str, document_type: str) -> Index:
        return self.tree.execute(
            data_source_id=data_source_id,
            data_source_name=data_source_name,
            document_type=document_type,
            packages=self.package_repository.list(),
        )

    def single(
        self, data_source_id: str, data_source_name: str, document_id: str, document_type: str, attribute: str = None
    ) -> Dict:
        document = self.document_repository.get(document_id)
        uid = document.uid
        # The tree can't handle dto, need to use one of the below
        if document.type == DMT.PACKAGE.value:
            document = self.package_repository.get(document.uid)
        elif document.type == SIMOS.BLUEPRINT.value:
            document = self.blueprint_repository.get(document.uid)
        else:
            dto = self.document_repository.get(document.uid)
            document = Entity(dto.data)
            document.uid = dto.uid

        if not hasattr(document, "uid"):
            document.uid = uid

        data = self.tree.execute(
            data_source_id=data_source_id,
            data_source_name=data_source_name,
            packages=[document],
            document_type=document_type,
        ).to_dict()

        del data[data_source_id]

        # Only return sub-part
        if attribute:
            list_values = [v for v in data.values()]
            attribute = find_attribute_by_title(attribute, list_values)
            result = {attribute["id"]: attribute}

            def append_children(children):
                for child in children:
                    child_instance = data[child]
                    result[child] = child_instance
                    append_children(child_instance["children"])

            append_children(attribute["children"])
            return result

        return data

from __future__ import annotations
from pathlib import Path
from typing import Union

from anytree import NodeMixin, PreOrderIter, RenderTree
from flask import g

from core.domain.blueprint import Blueprint
from core.domain.entity import Entity
from core.domain.package import Package
from core.domain.storage_recipe import StorageRecipe
from core.domain.ui_recipe import UIRecipe
from core.repository.interface.package_repository import PackageRepository
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.use_case.utils.generate_index_menu_actions import (
    get_delete_document_menu_item,
    get_not_contained_menu_action,
    get_package_create_document_menu_item,
    get_package_create_package_menu_item,
    get_update_document_menu_item,
)
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint
from core.use_case.utils.get_ui_recipe import get_ui_recipe
from core.enums import DataSourceDocumentType, DMT, SIMOS


class DocumentNode(NodeMixin):
    def __init__(
        self,
        data_source_id: str,
        name: str,
        menu_items,
        on_select=None,
        document: Blueprint = None,
        blueprint: Blueprint = None,
        parent: DocumentNode = None,
    ):
        self.data_source_id = data_source_id
        self.name = name
        self.document = document
        self.blueprint = blueprint
        self.parent = parent
        if not menu_items:
            menu_items = []
        if not on_select:
            on_select = None
        self.on_select = on_select
        self.menu_items = menu_items

    @property
    def uid(self):
        if self.document:
            return self.document.uid

    @property
    def start_path(self):
        return "/".join([node.name for node in self.path])

    @property
    def id(self):
        if self.document:
            return f"{self.start_path}/{self.document.uid}"
        elif self.depth == 0:
            return self.data_source_id
        else:
            return "WRONG!"

    def to_node(self):
        result = {
            "parentId": None if not self.parent else self.parent.id,
            "filename": self.name,
            "title": self.name,
            "id": self.id,
            "nodeType": "document-node",
            "children": [child.to_node()["id"] for child in self.children],
            "type": "datasource" if not self.document else self.document.type,
            "meta": {"menuItems": self.menu_items, "onSelect": self.on_select},
        }
        return result


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
                # logger.warning(f"Add ref '{ref}' {item_type}")
                if item_type == DMT.PACKAGE.value:
                    document = self.package_repository.get(ref["_id"])
                    # document.packages = [{"name": p.name, "type": p.type, "_id": p.uid} for p in document.packages]
                elif item_type == SIMOS.BLUEPRINT.value:
                    document = self.blueprint_repository.get(ref["_id"])
                else:
                    dto = self.document_repository.get(ref["_id"])
                    document = Entity(dto.data)
                    document.uid = dto.uid

                if not document:
                    raise EntityNotFoundException(uid=ref)
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
            document=Blueprint(uid=uid, name=instance["name"], description="", type=attribute_type),
            blueprint=None,
            parent=parent_node,
            on_select={
                "uid": uid,
                "title": instance["name"],
                "component": "blueprint",
                "data": {
                    "dataUrl": f"/api/v2/documents/{data_source_id}/{document_id}",
                    "schemaUrl": f"/api/v2/json-schema/{attribute_type}",
                    "attribute": ".".join(current_path),
                },
            },
            menu_items=[],
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
        # print(f"adding {attribute_type} to {'.'.join(document_path)}")
        for index, instance in enumerate(values):
            if isinstance(instance, dict):
                self.generate_contained_node(
                    document_id, document_path, instance, index, data_source_id, attribute_type, parent_node, True
                )

    def process_document(
        self,
        data_source_id,
        document: Union[Blueprint, Package],
        parent_node: DocumentNode,
        document_type: DataSourceDocumentType,
    ):
        # logger.info(f"Add attributes for '{document.name}'")

        is_package = document.type == DMT.PACKAGE.value
        blueprint = get_blueprint(document.type)
        parent_is_data_source = parent_node.document is None

        # Set which attribute on the parent the child belongs in
        if not parent_is_data_source and parent_node.document.type == DMT.PACKAGE.value:
            parent_attribute = "content"
        else:
            parent_attribute = Path(parent_node.start_path).name

        # Every node gets an delete and update action
        menu_items = [
            get_update_document_menu_item(data_source_id, name=document.name, document_id=document.uid),
            get_delete_document_menu_item(
                data_source_id, parent_id=parent_node.uid, parent_attribute=parent_attribute, document_id=document.uid
            ),
        ]

        # Runnable entities gets an custom action
        if document.type == g.application_settings["runnable"]["input"]:
            menu_items.append(
                {
                    "label": f"Run {g.application_settings['runnable']['name']}",
                    "action": "RUNNABLE",
                    "data": {
                        "prompt": {
                            "title": f"{g.application_settings['runnable']['name']}",
                            "content": f"{g.application_settings['runnable']['description']}",
                        },
                        "runnable": g.application_settings["runnable"],
                        "documentId": document.uid,
                        "dataSourceId": data_source_id,
                    },
                }
            )

        # Applications can be downloaded
        if document.type == SIMOS.APPLICATION.value:
            menu_items.append(
                {
                    "label": "Create Application",
                    "action": "DOWNLOAD",
                    "data": {
                        "url": f"/api/v2/system/{data_source_id}/create-application/{document.uid}",
                        "prompt": {"title": "Create Application", "content": "Download the application"},
                    },
                }
            )

        node = DocumentNode(
            data_source_id=data_source_id,
            name=document.name,
            document=document,
            blueprint=blueprint,
            parent=parent_node,
            on_select={
                "uid": document.uid,
                "title": document.name,
                "component": "blueprint",
                "data": {
                    "dataUrl": f"/api/v2/documents/{data_source_id}/{document.uid}",
                    "schemaUrl": f"/api/v2/json-schema/{document.type}",
                },
            },
            menu_items=menu_items,
        )

        # Packages should not open a tab on click
        if is_package:
            node.on_select = {}

        if not blueprint:
            raise EntityNotFoundException(uid=document.type)

        storage_recipe: StorageRecipe = get_storage_recipe(blueprint)
        ui_recipe: UIRecipe = get_ui_recipe(blueprint, "EDIT")

        attribute_nodes = []
        # Use the blueprint to find attributes that contains references
        for attribute in blueprint.get_attributes_with_reference():
            name = attribute["name"]
            # What blueprint is this attribute pointing too

            is_contained_in_storage = storage_recipe.is_contained(attribute["name"], attribute["type"])
            is_contained_in_ui = ui_recipe.is_contained(attribute)

            # print(f"-----------{document.name}:{name}:{is_contained_in_storage}:{is_contained_in_ui}-----------")

            if is_contained_in_ui:
                continue

            # If the attribute is an array
            if attribute.get("dimensions", "") == "*":
                # print(attribute)
                item_type = get_blueprint(attribute["type"])

                # TODO: Could we use same endpoint?
                add_file_type = (
                    "add-entity-file" if document_type == DataSourceDocumentType.ENTITIES.value else "add-file"
                )
                data = {}
                for item in item_type.get_attribute_names():
                    data[item] = ("${" + item + "}",)

                not_contained_menu_action = get_not_contained_menu_action(
                    data_source_id=data_source_id,
                    name=document.name,
                    url_type=add_file_type,
                    type=attribute["type"],
                    parent_id=getattr(document, "uid", None),
                    data=data,
                )
                if item_type.name == "list":
                    pass
                if isinstance(attribute["type"], set):
                    pass
                contained_menu_action = {
                    "label": "New",
                    "menuItems": [
                        {
                            "label": f"{item_type.name}",
                            "action": "CREATE",
                            "data": {
                                "url": f"/api/v2/explorer/{data_source_id}/{add_file_type}",
                                "schemaUrl": f"/api/v2/json-schema/{attribute['type']}?ui_recipe=DEFAULT_CREATE",
                                "request": {
                                    "type": attribute["type"],
                                    "parentId": getattr(document, "uid", None),
                                    "attribute": name,
                                    "data": data,
                                    "name": "${name}",
                                },
                            },
                        }
                    ],
                }

                # TODO: Refactor, we can move this package stuff to top and skip rest of the processing part.
                # TODO: Now, the DMT/Package has a content:type:Entity, just to not break. It should be "type: any"
                # Packages gets a "new package", and "new blueprint/entity" action
                if is_package:
                    node.menu_items.append(
                        {
                            "label": "New",
                            "menuItems": [
                                get_package_create_document_menu_item(
                                    data_source_id=data_source_id,
                                    parent_id=getattr(document, "uid", None),
                                    data=data,
                                    document_type=document_type,
                                ),
                                get_package_create_package_menu_item(
                                    data_source_id=data_source_id, parent_id=getattr(document, "uid", None), data=data
                                ),
                            ],
                        }
                    )
                    attribute_node = node
                else:
                    # Create a placeholder node that can contain real documents
                    attribute_node = DocumentNode(
                        data_source_id=data_source_id,
                        name=name,
                        document=document,
                        blueprint=blueprint,
                        parent=node,
                        menu_items=[contained_menu_action if is_contained_in_storage else not_contained_menu_action],
                    )

                # Check if values for the attribute exists in current document,
                # this means that we have added some documents to this array.
                values = document.get_values(name)
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
                            data_source_id, document.uid, [name], attribute["type"], values, attribute_node
                        )
            else:
                values = document.get_values(name)
                if values:
                    # Values are stored in separate document
                    if not is_contained_in_storage:
                        attribute_nodes.append(
                            {"documents": self.get_references(values, attribute["type"]), "node": node}
                        )
                else:
                    node.menu_items.append(
                        {
                            "label": f"Create {attribute['name']}",
                            "action": "CREATE",
                            "data": {
                                "url": f"/api/v2/explorer/{data_source_id}/add-file",
                                "schemaUrl": f"/api/v2/json-schema/{attribute['type']}?ui_recipe=DEFAULT_CREATE",
                                "nodeUrl": f"/api/v3/index/{data_source_id}",
                                "request": {
                                    "type": attribute["type"],
                                    "parentId": getattr(document, "uid", None),
                                    "attribute": name,
                                    "name": "${name}",
                                },
                            },
                        }
                    )

                if is_contained_in_storage:
                    self.generate_contained_node(
                        document.uid, [name], attribute, None, data_source_id, attribute["type"], node, False
                    )

        for attribute_node in attribute_nodes:
            for attribute_document in attribute_node["documents"]:
                self.process_document(
                    data_source_id=data_source_id,
                    document=attribute_document,
                    parent_node=attribute_node["node"],
                    document_type=DataSourceDocumentType(document_type),
                )

    def execute(self, data_source_id: str, data_source_name: str, packages, document_type: str) -> Index:

        index = Index(data_source_id=data_source_id)

        # Set what Models the user can create on the data_source node
        # TODO: More generic page1, page2, ...
        models = (
            g.application_settings["blueprintsModels"]
            if document_type == "blueprints"
            else g.application_settings["entityModels"]
        )

        new_models = [
            {
                "label": "Package",
                "action": "CREATE",
                "data": {
                    "url": f"/api/v2/explorer/{data_source_id}/add-root-package",
                    "schemaUrl": f"/api/v2/json-schema/{model}?ui_recipe=DEFAULT_CREATE",
                    "nodeUrl": f"/api/v3/index/{data_source_id}",
                    "request": {"name": "${name}", "type": model},
                },
            }
            for model in models
        ]

        root_node = DocumentNode(
            data_source_id=data_source_id,
            name=data_source_name,
            menu_items=[{"label": "New", "menuItems": new_models}],
        )

        for package in packages:
            self.process_document(data_source_id, package, root_node, DataSourceDocumentType(document_type))

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

    def single(self, data_source_id: str, data_source_name: str, document_id: str, document_type: str) -> Index:
        document = self.document_repository.get(document_id)
        # The tree can't handle dto, need to use one of the below
        if document.type == DMT.PACKAGE.value:
            document = self.package_repository.get(document.uid)
        elif document.type == SIMOS.BLUEPRINT.value:
            document = self.blueprint_repository.get(document.uid)
        else:
            dto = self.document_repository.get(document.uid)
            document = Entity(dto.data)
            document.uid = dto.uid

        data = self.tree.execute(
            data_source_id=data_source_id,
            data_source_name=data_source_name,
            packages=[document],
            document_type=document_type,
        ).to_dict()
        del data[data_source_id]
        return data

from pathlib import Path
from typing import Dict, List

from anytree import PreOrderIter, RenderTree

from classes.blueprint_attribute import BlueprintAttribute
from config import Config
from classes.dto import DTO
from classes.index import DocumentNode
from classes.recipe import PRIMITIVES, Recipe
from core.enums import DMT, SIMOS
from core.repository import Repository
from core.repository.repository_exceptions import EntityNotFoundException
from core.use_case.utils.find_parent import find_parent
from core.use_case.utils.generate_index_menu_actions import (
    get_contained_menu_action,
    get_create_root_package_menu_item,
    get_delete_document_menu_item,
    get_download_menu_action,
    get_dynamic_create_menu_item,
    get_export_menu_item,
    get_import_menu_item,
    get_node_on_select,
    get_remove_attribute_menu_item,
    get_rename_attribute_menu_action,
    get_rename_menu_action,
    get_runnable_menu_action,
)
from core.utility import get_blueprint
from core.use_case.utils.get_ui_recipe import get_recipe
from core.use_case.utils.sort_menu_items import sort_menu_items
from utils.data_structure.find import get
from utils.group_by import group_by
from utils.logging import logger


def find_attribute_by_id(name: str, attributes: List):
    return next((x for x in attributes if x["id"] == name), None)


class Index:
    def __init__(self, data_source_id: str):
        self.data_source_id = data_source_id
        self.index = {}

    def add(self, adict):
        self.index[adict["id"]] = adict

    def to_dict(self, *, include_defaults: bool = True):
        return self.index


def print_tree(root_node):
    for pre, fill, node in RenderTree(root_node):
        treestr = "%s%s" % (pre, node.name)
        print(treestr.ljust(8), node.uid, node.to_node()["nodeType"], node.document["type"] if node.document else "")


def get_error_node(document: DTO, parent_node: DocumentNode, data_source_id: str) -> DocumentNode:
    return DocumentNode(
        document=document,
        data_source_id=data_source_id,
        name=get(document, "name", default=None),
        parent=parent_node,
        menu_items=[],
        error=True,
    )


class Tree:
    def __init__(
        self, document_repository: Repository,
    ):
        self.document_repository = document_repository

    def get_references(self, references) -> List[DTO]:
        documents = []
        for ref in references:
            dto = self.document_repository.get(ref["_id"])
            if not dto:
                logger.warning(f"The reference {ref['name']} was not found")
                dto = DTO(data={"name": ref["name"], "_not_found_": True, "uid": "notFound", "type": "notFound"})

            documents.append(dto)
        return documents

    def generate_contained_node(
        self, document_id, document_path, instance: Dict, index, data_source_id, attribute_type, parent_node, is_array
    ):
        if is_array:
            uid = f"{document_id}.{'.'.join(document_path)}.{index}"
            current_path = document_path + [f"{index}"]
        else:
            uid = f"{document_id}.{'.'.join(document_path)}"
            current_path = document_path

        create_new_menu_items = []
        blueprint = get_blueprint(instance["type"])
        for attr in blueprint.attributes:
            if "/" in attr.type:
                if attr.dimensions == "*":
                    attribute_name = ".".join(document_path) + "." + str(index) + "." + attr.name
                    create_new_menu_items.append(
                        get_dynamic_create_menu_item(
                            data_source_id, "Create " + attr.name, attr.type, document_id, attribute_name
                        )
                    )
        menu_items = [{"label": "New", "menuItems": create_new_menu_items}] if len(create_new_menu_items) > 0 else None

        node = DocumentNode(
            data_source_id=data_source_id,
            name=instance["name"],
            document=DTO(data=instance, uid=uid),
            blueprint=None,
            parent=parent_node,
            on_select={
                "uid": uid,
                "title": instance["name"],
                "component": "blueprint",
                "data": {
                    "dataUrl": f"/api/v2/documents/{data_source_id}"
                    f"/{document_id}?attribute={'.'.join(current_path)}",
                    "schemaUrl": f"/api/v2/json-schema/{attribute_type}",
                },
            },
            menu_items=menu_items,
            is_contained=False,
        )

        if is_array or instance.get("optional", False):
            node.menu_items.append(
                get_remove_attribute_menu_item(
                    data_source_id, parent_id=parent_node.uid, attribute=".".join(current_path)
                )
            )

        if is_array:
            attribute_blueprint = get_blueprint(instance["type"])
            data = {}
            for item in attribute_blueprint.get_attribute_names():
                data[item] = ("${" + item + "}",)
            contained_menu_action = get_contained_menu_action(
                data_source_id=data_source_id,
                name=".".join(document_path),
                node_id=uid,
                type=attribute_type,
                parent_id=document_id,
                data=data,
            )
            node.menu_items.append(contained_menu_action)

        node.menu_items.append(
            get_rename_attribute_menu_action(
                data_source_id, parent_id=document_id, type=attribute_type, name=uid, attribute=".".join(current_path),
            )
        )

        blueprint = get_blueprint(attribute_type)
        recipe: Recipe = get_recipe(blueprint=blueprint, plugin_name="INDEX")
        for attribute in blueprint.get_none_primitive_types():
            name = attribute.name
            attr_type = attribute.type

            is_contained_in_ui = recipe.is_contained(attribute)
            if not is_contained_in_ui:
                continue

            if parent_node.blueprint and blueprint == parent_node.blueprint:
                continue

            is_array = attribute.dimensions == "*"
            if is_array and attribute_type is not SIMOS.BLUEPRINT.value:
                if attr_type not in PRIMITIVES:
                    is_recursive = attr_type.split("/")[-1] == blueprint.name
                    if is_recursive and is_array and len(current_path) > 2:
                        # prevent generate endless nodes.
                        return

            self.generate_contained_node(
                document_id,
                current_path + [f"{name}"],
                attribute.to_dict(),
                None,
                data_source_id,
                attribute.type,
                node,
                attribute.dimensions == "*",
            )

    def generate_contained_nodes(
        self, data_source_id, document_id, document_path, attribute_type, values: List[Dict], parent_node
    ):
        for index, instance in enumerate(values):
            try:
                self.generate_contained_node(
                    document_id, document_path, instance, index, data_source_id, attribute_type, parent_node, True
                )
            except Exception as error:
                logger.exception(error)
                get_error_node(document=DTO(data=instance), parent_node=parent_node, data_source_id=data_source_id)
                logger.warning(f"Caught error while processing document {document_path}: {error}")

    def process_document(self, data_source_id, document: DTO, parent_node: DocumentNode, app_settings: Dict):
        if get(document, "_not_found_", default=None):
            get_error_node(document, parent_node, data_source_id)
            return
        # FIXME: Check that document is a reference
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

        if is_package:
            # Set Package isRoot attribute
            node.is_root_package = document.data.get("isRoot")

            # Packages should not open a tab on click
            node.on_select = {}

        if node.is_root_package:
            node.menu_items.append(get_export_menu_item(data_source_id=data_source_id, document_id=document.uid))
            node.menu_items.append(get_import_menu_item(data_source_id=data_source_id, document_id=document.uid))

        # Every node gets an delete and rename action
        node.menu_items.append(
            get_rename_menu_action(
                data_source_id=data_source_id, document_id=document.uid, type=document.type, parent_id=parent_node.uid,
            )
        )
        node.menu_items.append(
            get_delete_document_menu_item(
                data_source_id, parent_id=parent_node.uid, parent_attribute=parent_attribute, document_id=document.uid,
            )
        )

        # Runnable entities gets an custom action
        action_types = group_by(
            items=app_settings["actions"], grouping_function=lambda runnable: runnable.get("input", ""),
        )

        if document.type in action_types:
            action_items = []

            for action in action_types[document.type]:
                action_items.append(
                    get_runnable_menu_action(data_source_id=data_source_id, document_id=document.uid, runnable=action)
                )
            node.menu_items.append({"label": "Actions", "menuItems": action_items})

        # Applications can be downloaded
        if document.type == SIMOS.APPLICATION.value:
            node.menu_items.append(get_download_menu_action(data_source_id, document.uid))

        # storage_recipe: StorageRecipe = get_storage_recipe(node.blueprint)
        # TODO: Fix blueprint class
        recipe: Recipe = get_recipe(blueprint=node.blueprint, plugin_name="INDEX")

        # If the node is a DMT-Package, add "Create New" from AppSettings, and newPackage
        if is_package:
            create_new_menu_items = []
            create_new_menu_items.append(
                get_dynamic_create_menu_item(data_source_id, "Package", DMT.PACKAGE.value, document.uid)
            )
            for model in app_settings["models"]:
                model_blueprint = get_blueprint(model)
                create_new_menu_items.append(
                    get_dynamic_create_menu_item(data_source_id, model_blueprint.name, model, document.uid)
                )
            attribute_node = node
            node.menu_items.append({"label": "New", "menuItems": create_new_menu_items})

        # Use the blueprint to find attributes that contains references
        for attribute in node.blueprint.get_none_primitive_types():
            attribute_name = attribute.name
            # is_contained_in_storage = is_contained(attribute.name, attribute["type"])

            is_contained_in_ui = recipe.is_contained(attribute)
            if not is_contained_in_ui:
                continue

            # If the attribute is an array
            # TODO: Handle fixed size arrays
            if attribute.dimensions == "*":
                attribute_blueprint = get_blueprint(attribute.type)

                data = {}
                for item in attribute_blueprint.get_attribute_names():
                    data[item] = ("${" + item + "}",)

                contained_menu_action = get_contained_menu_action(
                    data_source_id=data_source_id,
                    name=attribute_name,
                    node_id=f"{document.uid}_{attribute_name}",
                    type=attribute.type,
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
                        menu_items=[contained_menu_action],
                        is_contained=True,
                    )

                # Check if values for the attribute exists in current document,
                # this means that we have added some documents to this array.
                if values := document.data.get(attribute_name):
                    # Values are stored in separate document
                    if is_package:
                        # Get real documents
                        attribute_nodes.append({"documents": self.get_references(values), "node": attribute_node})
                    # Values are stored inside parent. We create placeholder nodes.
                    else:
                        self.generate_contained_nodes(
                            data_source_id, document.uid, [attribute_name], attribute.type, values, attribute_node,
                        )
            # If the attribute is NOT an array
            else:
                if values := document.data.get(attribute_name) and is_package:
                    attribute_nodes.append({"documents": self.get_references(values), "node": node})

                # TODO: After last menu_item is appended, sort the list.

                if not is_package:
                    self.generate_contained_node(
                        document.uid,
                        [attribute_name],
                        attribute.to_dict(),
                        None,
                        data_source_id,
                        attribute.type,
                        node,
                        False,
                    )

        node.menu_items = sort_menu_items(node.menu_items)

        for attribute_node in attribute_nodes:
            for attribute_document in attribute_node["documents"]:
                try:
                    self.process_document(
                        data_source_id=data_source_id,
                        document=attribute_document,
                        parent_node=attribute_node["node"],
                        app_settings=app_settings,
                    )
                except Exception as error:
                    logger.exception(error)
                    get_error_node(document=attribute_document, parent_node=parent_node, data_source_id=data_source_id)
                    logger.warning(f"Caught error while processing document {node.name}: {error}")

    def execute(self, data_source_id: str, data_source_name: str, packages: List[DTO], application_page: str) -> Index:

        index = Index(data_source_id=data_source_id)

        # Set what Models the user can create on the data_source node and Package nodes
        # TODO: More generic page1, page2, ...
        app_settings = (
            Config.DMT_APPLICATION_SETTINGS if application_page == "blueprints" else Config.ENTITY_APPLICATION_SETTINGS
        )

        # The root-node (data_source) can always create a package
        root_node = DocumentNode(
            data_source_id=data_source_id,
            name=data_source_name,
            menu_items=[get_create_root_package_menu_item(data_source_id)],
        )

        for package in packages:
            try:
                self.process_document(data_source_id, package, root_node, app_settings)
            except Exception as error:
                logger.exception(error)
                get_error_node(package, root_node, data_source_id)
                logger.warning(f"Caught error while processing document {package.name}: {error}")

        for node in PreOrderIter(root_node):
            index.add(node.to_node())

        return index


class GenerateIndexUseCase:
    def __init__(self, document_repository: Repository):
        self.document_repository = document_repository
        self.tree = Tree(document_repository)

    def execute(self, data_source_id: str, data_source_name: str, document_type: str) -> Index:
        return self.tree.execute(
            data_source_id=data_source_id,
            data_source_name=data_source_name,
            application_page=document_type,
            packages=self.document_repository.find({"type": "system/DMT/Package", "isRoot": True}, single=False),
        )

    def single(
        self, data_source_id: str, data_source_name: str, document_id: str, document_type: str, attribute: str = None
    ) -> Dict:
        document = self.document_repository.get(document_id)
        uid = document.uid
        # The tree can't handle dto, need to use one of the below
        document = self.document_repository.get(document.uid)

        if not hasattr(document, "uid"):
            document.uid = uid

        data = self.tree.execute(
            data_source_id=data_source_id,
            data_source_name=data_source_name,
            packages=[document],
            application_page=document_type,
        ).to_dict()

        del data[data_source_id]

        for root_package in self.document_repository.find(
            filter={"type": "system/DMT/Package", "isRoot": True}, single=False
        ):
            parent_id = find_parent(root_package, document_id, self.document_repository)
            if parent_id:
                data[document_id]["parentId"] = parent_id

        # Only return node for attribute document
        if attribute:
            list_values = [v for v in data.values()]
            attribute = find_attribute_by_id(attribute, list_values)
            result = {attribute["id"]: attribute}

            def append_children(children):
                for child in children:
                    child_instance = data[child]
                    result[child] = child_instance
                    append_children(child_instance["children"])

            append_children(attribute["children"])
            return result

        return data

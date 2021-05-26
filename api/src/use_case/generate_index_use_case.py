from typing import Dict, Union

from domain_classes.blueprint_attribute import BlueprintAttribute
from enums import APPLICATION, DMT
from repository.repository_exceptions import EntityNotFoundException
from services.document_service import DocumentService
from use_case.utils.index_menu_actions import get_node_fetch, get_node_index
from use_case.utils.set_index_context_menu import create_context_menu
from services.dmss import dmss_api
from utils.logging import logger

from domain_classes.recipe import RecipePlugin
from domain_classes.tree_node import Node, ListNode
from config import Config


def get_parent_id(data_source_id: str, node: Union[Node, ListNode]):
    if node.parent:
        # Adjust parent, since we skipped content node
        if node.parent.parent and node.parent.parent.type == DMT.PACKAGE.value:
            return node.parent.parent.node_id
        return node.parent.node_id
    else:
        return data_source_id


def get_error_node(data_source_id: str, node: Union[Node]) -> Dict:
    return {
        "parentId": get_parent_id(data_source_id, node),
        "title": node.name,
        "id": node.node_id,
        "nodeType": "document-node",
        "children": [],
        "type": node.type,
        "meta": {
            "menuItems": [],
            "onSelect": {},
            "error": True,
            "isRootPackage": node.is_root(),
            "isList": node.is_array(),
        },
    }


def get_node(node: Union[Node], data_source_id: str, app_settings: dict) -> Dict:
    menu_items = create_context_menu(node, data_source_id, app_settings)

    children = []
    if node.type == DMT.PACKAGE.value:
        # Skip content node
        if node.has_children():
            # Content node is always the only node in package
            content_node = node.children[0]
            children = [child.node_id for child in content_node.children if is_visible(child)]
    else:
        children = [child.node_id for child in node.children if is_visible(child)]

    return {
        "parentId": get_parent_id(data_source_id, node),
        "title": node.name,
        "id": node.node_id,
        "nodeType": "document-node" if node.type != DMT.PACKAGE.value else DMT.PACKAGE.value,
        "children": children,
        "type": node.type,
        "meta": {
            "menuItems": menu_items,
            "fetchUrl": get_node_fetch(data_source_id, node) if node.is_single() else {},
            "indexUrl": get_node_index(data_source_id, node),
            "error": False,
            "isRootPackage": node.type == DMT.PACKAGE.value and node.entity.get("isRoot"),
            "isList": node.is_array(),
            "dataSource": data_source_id,
            "empty": node.is_empty(),
            "hasCustomAction": node.type in [e["input"] for e in app_settings["actions"]],
            "application": app_settings["name"],
        },
    }


def is_visible(node):
    if node.is_root():
        return True
    elif node.is_complex_array():
        return False
    elif node.is_empty() and not node.is_array():
        return False
    if node.parent.blueprint is None:
        return True

    ui_recipe = node.parent.blueprint.get_ui_recipe_by_plugin(name="INDEX")
    return ui_recipe.is_contained(node.attribute, RecipePlugin.INDEX)


def extend_index_with_node_tree(
    root: Union[Node, ListNode], data_source_id: str, app_settings: dict, traverse_depth: int = 999
):
    index = {}

    for node in root.traverse(depth_limit=traverse_depth):
        try:
            # Skip package's content node
            if node.parent and node.parent.type == DMT.PACKAGE.value:
                continue
            if not is_visible(node):
                continue
            if node.has_error:
                index[node.node_id] = get_error_node(data_source_id, node)
            else:
                index[node.node_id] = get_node(node, data_source_id, app_settings)

        except Exception as error:
            logger.exception(error)
            logger.warning(f"Caught error while processing document: {error}")
    return index


class GenerateIndexUseCase:
    def execute(self, data_source_id: str, application: str = None) -> dict:
        document_service = DocumentService()
        app_settings = Config.DMT_SETTINGS if application == APPLICATION.DMT_ENTITIES.value else Config.APP_SETTINGS
        # make sure we're generating the index with correct blueprints.
        root_packages = dmss_api.package_get(data_source_id)

        root = Node(
            key="root",
            uid=data_source_id,
            entity={"type": "datasource", "name": data_source_id},
            blueprint_provider=document_service.blueprint_provider,
            attribute=BlueprintAttribute("root", "datasource", contained=False),
        )
        for root_package in root_packages:
            package_data = root_package["data"]
            try:
                root.add_child(
                    document_service.get_node_by_uid(
                        data_source_id=data_source_id, document_uid=package_data["_id"], depth=0
                    )
                )
            except EntityNotFoundException as error:
                logger.exception(error)
                error_node: Node = Node(
                    key=package_data["_id"],
                    uid=package_data["_id"],
                    entity={"name": package_data["name"], "type": ""},
                    blueprint_provider=document_service.get_blueprint,
                    attribute=BlueprintAttribute("root", "datasource"),
                )
                error_node.set_error(f"failed to add root package {package_data['name']} to the root node")
                root.add_child(error_node)
            except Exception as error:
                logger.exception(f"{error}, unhandled exception.")

        # This traverse depth will only fetch index of root-packages
        return extend_index_with_node_tree(root, data_source_id, app_settings, traverse_depth=2)

    def single(self, data_source_id: str, document_id: str, parent_id: str, application: str = None) -> Dict:
        document_service = DocumentService()

        app_settings = Config.DMT_SETTINGS if application == APPLICATION.DMT_ENTITIES.value else Config.APP_SETTINGS
        parent_uid = parent_id.split(".", 1)[0]

        # If root-package post DS-id as parent_id. We must create a parent node.
        if data_source_id == parent_uid:
            parent = Node(
                key="root",
                uid=data_source_id,
                entity={"type": "datasource", "name": data_source_id},
                blueprint_provider=document_service.get_blueprint,
                attribute=BlueprintAttribute("root", "datasource", contained=True),
            )
            parent.add_child(
                document_service.get_node_by_uid(data_source_id=data_source_id, document_uid=document_id, depth=0)
            )
        else:
            parent = document_service.get_node_by_uid(data_source_id=data_source_id, document_uid=parent_uid, depth=1)

        if not parent and data_source_id != document_id:
            raise EntityNotFoundException(uid=parent_id)
        node = parent.search(document_id)
        if not node:  # Create an error_node
            node = Node(
                parent=parent.children[0],
                key="99",
                uid=document_id,
                entity={"name": document_id, "type": DMT.ENTITY.value, "_id": document_id},
                blueprint_provider=document_service.get_blueprint,
                attribute=BlueprintAttribute("error", DMT.ENTITY.value),
            )
            node.set_error(f"failed to create node '{document_id}' on '{parent.name}'")
        return extend_index_with_node_tree(node, data_source_id, app_settings, traverse_depth=3)

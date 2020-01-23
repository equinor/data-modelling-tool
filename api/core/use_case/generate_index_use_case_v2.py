from typing import Dict, List, Union

from classes.recipe import Recipe
from classes.tree_node import Node
from config import Config
from core.enums import DMT
from core.repository import Repository
from core.service.document_service import DocumentService
from core.use_case.utils.generate_index_menu_actions_v2 import (
    get_create_root_package_menu_item,
    get_node_on_select,
)
from core.use_case.utils.get_ui_recipe import get_recipe
from core.use_case.utils.set_index_context_menu import create_context_menu
from utils.logging import logger


def get_contained_tree_node_by_attributes(attributes_list: List, tree_node: Union[Node]):
    if len(attributes_list) == 1:
        if tree_node.is_array():
            return tree_node.children[int(attributes_list[0])]
        else:
            return next((x for x in tree_node.children if x.name == attributes_list[0]))
    if tree_node.is_array():
        next_tree_node = tree_node.children[int(attributes_list[0])]
    else:
        next_tree_node = next((x for x in tree_node.children if x.name == attributes_list[0]))
    attributes_list.pop(0)
    return get_contained_tree_node_by_attributes(attributes_list, next_tree_node)


def get_tree_node_by_nested_id(document_id: str, repository: Repository) -> Union[Node]:
    uid_and_attributes = document_id.split(".")
    document = DocumentService.get_tree_node_by_uid(document_uid=uid_and_attributes[0], repository=repository)
    if len(uid_and_attributes) > 1:
        contained_document = get_contained_tree_node_by_attributes(uid_and_attributes[1:], document)
        return contained_document
    return document


def get_error_node(node: Union[Node]) -> Dict:
    return {
        "parentId": node.parent.node_id if node.parent else None,
        "title": node.name,
        "id": node.node_id,
        "nodeType": "document-node",
        "children": [],
        "type": node.type,
        "meta": {
            "menuItems": [],
            "onSelect": {},
            "error": True,
            "isRootPackage": node.dto.get("isRoot") if node.is_single() else False,
            "isList": node.is_array(),
        },
    }


def get_node(node: Union[Node], data_source_id: str, app_settings: dict) -> Dict:
    menu_items = create_context_menu(node, data_source_id, app_settings,)

    children = []
    if node.type == DMT.PACKAGE.value:
        # Skip content node
        if (len(node.children)) > 0:
            content = node.children[0]
            children = [child.node_id for child in content.children]
    else:
        children = [child.node_id for child in node.children]

    return {
        "parentId": node.parent.node_id if node.parent else None,
        "title": node.name,
        "id": node.node_id,
        "nodeType": "document-node",
        "children": children,
        "type": node.type,
        "meta": {
            "menuItems": menu_items,
            "onSelect": get_node_on_select(data_source_id, node)
            if node.is_single() and node.type != DMT.PACKAGE.value
            else {},
            "error": False,
            "isRootPackage": node.dto.get("isRoot") if node.is_single() else False,
            "isList": node.is_array(),
        },
    }


def extend_index_with_node_tree(root: Union[Node], data_source_id: str, app_settings: dict):
    index = {}

    for node in root.traverse():
        try:
            recipe: Recipe = get_recipe(blueprint=node.blueprint if node.is_single() else None, plugin_name="INDEX")

            if node.parent and node.parent.type == DMT.PACKAGE.value:
                continue

            if not recipe.is_contained_in_index2(node.name, node.type, node.is_array()):
                continue

            index[node.node_id] = get_node(node, data_source_id, app_settings)

        except Exception as error:
            logger.exception(error)
            index[node.node_id] = get_error_node(node)
            logger.warning(f"Caught error while processing document {node.name}: {error}")

    return index


class GenerateIndexUseCase:
    @staticmethod
    def execute(data_source_id: str, repository: Repository, application_page: str) -> dict:
        app_settings = (
            Config.DMT_APPLICATION_SETTINGS if application_page == "blueprints" else Config.ENTITY_APPLICATION_SETTINGS
        )
        root_packages = repository.find({"type": "system/DMT/Package", "isRoot": True}, single=False)

        index: Dict = {
            data_source_id: {
                "parentId": None,
                "title": data_source_id,
                "id": data_source_id,
                "nodeType": "document-node",
                "children": [root_package.uid for root_package in root_packages],
                "type": "datasource",
                "meta": {"menuItems": [get_create_root_package_menu_item(data_source_id)]},
            }
        }

        for root_package in root_packages:
            node = DocumentService.get_tree_node_by_uid(document_uid=root_package.uid, repository=repository)
            node.show_tree()
            index.update(extend_index_with_node_tree(node, data_source_id, app_settings))

        return index

    def single(self, repository: Repository, document_id: str, application_page: str, parent_id: str) -> Dict:
        data_source_id = repository.name
        app_settings = (
            Config.DMT_APPLICATION_SETTINGS if application_page == "blueprints" else Config.ENTITY_APPLICATION_SETTINGS
        )

        node: Union[Node] = get_tree_node_by_nested_id(document_id=document_id, repository=repository)

        return extend_index_with_node_tree(node, data_source_id, app_settings)

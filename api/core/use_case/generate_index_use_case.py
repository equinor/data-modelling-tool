from typing import Dict, Union

from core.enums import DMT
from core.repository.repository_exceptions import EntityNotFoundException
from core.repository.repository_factory import get_repository
from core.service.document_service import DocumentService
from core.use_case.utils.generate_index_menu_actions_v2 import get_node_on_select
from core.use_case.utils.get_ui_recipe import get_recipe
from core.use_case.utils.set_index_context_menu import create_context_menu
from utils.logging import logger

from classes.dto import DTO
from classes.tree_node import Node, NodeBase
from config import Config


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


def get_node(node: Union[Node], data_source_id: str, application_page: str) -> Dict:
    menu_items = create_context_menu(node, data_source_id, application_page)

    children = []
    if node.type == DMT.PACKAGE.value:
        # Skip content node
        if node.has_children():
            # Content node is always the only node in package
            content_node = node.children[0]
            children = [child.node_id for child in content_node.children if is_visible(child)]
    else:
        children = [child.node_id for child in node.children if is_visible(child)]

    parent_id = None
    if node.parent:
        parent_id = node.parent_node_id
        # Adjust parent, since we skipped content node
        if node.parent.parent and node.parent.parent.type == DMT.PACKAGE.value:
            parent_id = node.parent.parent.node_id

    return {
        "parentId": parent_id,
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


def get_ui_recipe(node, plugin_name):
    parent_has_blueprint = hasattr(node.parent, "blueprint")
    if parent_has_blueprint:
        return get_recipe(blueprint=node.parent.blueprint, plugin_name=plugin_name)
    return get_recipe(blueprint=None, plugin_name=plugin_name)


def is_visible(node, plugin_name="INDEX"):
    if node.is_root():
        return True
    return get_ui_recipe(node, plugin_name).is_contained_in_index2(
        node.parent.key if node.parent.is_array() else node.key, node.attribute_type, node.is_array()
    )


def extend_index_with_node_tree(root: Union[Node, NodeBase], data_source_id: str, application_page: str):
    index = {}

    for node in root.traverse():
        try:
            # Skip package's content node
            if node.parent and node.parent.type == DMT.PACKAGE.value:
                continue

            if not is_visible(node):
                continue

            index_node = get_node(node, data_source_id, application_page)
            if "errorMsg" in node.dto.data:
                index[node.node_id] = get_error_node(node)
            else:
                index[node.node_id] = index_node

        except Exception as error:
            logger.exception(error)
            index[node.node_id] = get_error_node(node)
            logger.warning(f"Caught error while processing document {node.name}: {error}")

    return index


class GenerateIndexUseCase:
    def __init__(self, repository_provider=get_repository):
        self.repository_provider = repository_provider

    def execute(self, data_source_id: str, application_page: str) -> dict:
        document_service = DocumentService(repository_provider=self.repository_provider)
        root_packages = document_service.get_root_packages(data_source_id=data_source_id)
        root = NodeBase(key="root", dto=DTO(uid=data_source_id, data={"type": "datasource", "name": data_source_id}))
        for root_package in root_packages:
            root.add_child(document_service.get_by_uid(data_source_id=data_source_id, document_uid=root_package.uid))
        return extend_index_with_node_tree(root, data_source_id, application_page)

    def single(self, data_source_id: str, document_id: str, application_page: str, parent_id: str) -> Dict:
        app_settings = (
            Config.DMT_APPLICATION_SETTINGS if application_page == "blueprints" else Config.ENTITY_APPLICATION_SETTINGS
        )
        document_service = DocumentService(repository_provider=self.repository_provider)
        parent = document_service.get_by_uid(data_source_id=data_source_id, document_uid=parent_id.split(".", 1)[0])
        if not parent:
            raise EntityNotFoundException(uid=parent_id)
        node = parent.search(document_id)
        if not node:
            raise EntityNotFoundException(uid=document_id)
        return extend_index_with_node_tree(node, data_source_id, app_settings)

from typing import Dict, List, Union

from anytree import PreOrderIter

from classes.index_v2 import DocumentNode
from classes.recipe import Recipe
from classes.tree_node import ListNode, Node
from config import Config
from core.enums import DMT
from core.repository import Repository
from core.service.document_service import DocumentService
from core.use_case.utils.generate_index_menu_actions_v2 import (
    get_create_root_package_menu_item,
    get_node_on_select,
)
from core.use_case.utils.get_ui_recipe import get_recipe
from core.use_case.utils.set_index_context_menu import set_index_context_menu
from utils.logging import logger


class Index:
    def __init__(self, data_source_id: str):
        self.data_source_id = data_source_id
        self.index = {}

    def add(self, adict):
        self.index[adict["id"]] = adict

    def to_dict(self):
        return self.index


def get_contained_tree_node_by_attributes(attributes_list: List, tree_node: Union[Node, ListNode]):
    if len(attributes_list) == 1:
        if isinstance(tree_node, ListNode):
            return tree_node.children[int(attributes_list[0])]
        else:
            return next((x for x in tree_node.children if x.name == attributes_list[0]))
    if isinstance(tree_node, ListNode):
        next_tree_node = tree_node.children[int(attributes_list[0])]
    else:
        next_tree_node = next((x for x in tree_node.children if x.name == attributes_list[0]))
    attributes_list.pop(0)
    return get_contained_tree_node_by_attributes(attributes_list, next_tree_node)


def get_tree_node_by_nested_id(document_id: str, repository: Repository) -> Union[Node, ListNode]:
    uid_and_attributes = document_id.split(".")
    document = DocumentService.get_tree_node_by_uid(document_uid=uid_and_attributes[0], repository=repository)
    if len(uid_and_attributes) > 1:
        contained_document = get_contained_tree_node_by_attributes(uid_and_attributes[1:], document)
        return contained_document
    return document


def get_error_node(tree_node: Union[Node, ListNode], parent_node: DocumentNode, data_source_id: str) -> DocumentNode:
    return DocumentNode(
        document=tree_node.dto,
        data_source_id=data_source_id,
        name=tree_node.name,
        parent=parent_node,
        menu_items=[],
        error=True,
    )


def extend_index_with_node_tree(
    tree_node: Union[Node, ListNode],
    data_source_id: str,
    app_settings: dict,
    parent: DocumentNode = None,
    is_root_package: bool = False,
    is_package_content: bool = False,
):
    # Check if the node is a DMT package, and NOT a "fake" package i.e "content"
    is_package = tree_node.type == DMT.PACKAGE.value and not is_package_content

    index_node = DocumentNode(
        type=tree_node.type,
        uid=tree_node.node_id,
        data_source_id=data_source_id,
        name=tree_node.name,
        document=tree_node.dto if isinstance(tree_node, Node) else {},
        # TODO: Blueprint should be appended in or before TreeNode
        blueprint=tree_node.blueprint if isinstance(tree_node, Node) else None,
        # blueprint=get_blueprint(tree_node.type),
        # If it's a package, no parent, so it will be left out of index. We add the package.content to index instead.
        parent=parent if not is_package else None,
        # List nodes should not be "clickable"
        on_select=get_node_on_select(data_source_id, tree_node) if isinstance(tree_node, Node) else {},
        menu_items=[],
    )

    set_index_context_menu(
        tree_node, index_node, data_source_id, app_settings, parent, is_root_package, is_package_content
    )

    recipe: Recipe = get_recipe(blueprint=index_node.blueprint, plugin_name="INDEX")
    for child in tree_node.children:
        child_is_list = isinstance(child, ListNode)

        if not recipe.is_contained_in_index2(child.name, child.type, child_is_list):
            continue
        try:
            if is_package:
                # Fake the "content" list in a package to behave like a "Package"
                child.type = DMT.PACKAGE.value
                child.name = tree_node.name
                extend_index_with_node_tree(
                    tree_node=child,
                    data_source_id=data_source_id,
                    app_settings=app_settings,
                    parent=parent,
                    is_root_package=tree_node.dto.get("isRoot"),
                    is_package_content=True,
                )
            else:
                extend_index_with_node_tree(
                    tree_node=child, data_source_id=data_source_id, app_settings=app_settings, parent=index_node
                )
        except Exception as error:
            logger.exception(error)
            get_error_node(tree_node=child, parent_node=parent, data_source_id=data_source_id)
            logger.warning(f"Caught error while processing document {child.name}: {error}")


class GenerateIndexUseCase:
    @staticmethod
    def execute(data_source_id: str, repository: Repository, application_page: str) -> dict:
        app_settings = (
            Config.DMT_APPLICATION_SETTINGS if application_page == "blueprints" else Config.ENTITY_APPLICATION_SETTINGS
        )
        index = Index(data_source_id=data_source_id)
        packages = repository.find({"type": "system/DMT/Package", "isRoot": True}, single=False)

        # The root-node (data_source) can always create a package
        root_node = DocumentNode(
            uid=data_source_id,
            type="datasource",
            data_source_id=data_source_id,
            name=data_source_id,
            menu_items=[get_create_root_package_menu_item(data_source_id)],
        )

        for package in packages:
            node = DocumentService.get_tree_node_by_uid(document_uid=package.uid, repository=repository)
            extend_index_with_node_tree(
                tree_node=node, data_source_id=data_source_id, parent=root_node, app_settings=app_settings
            )

        for node in PreOrderIter(root_node):
            index.add(node.to_node())

        return index.to_dict()

    def single(self, repository: Repository, document_id: str, application_page: str, parent_id: str) -> Dict:
        data_source_id = repository.name
        app_settings = (
            Config.DMT_APPLICATION_SETTINGS if application_page == "blueprints" else Config.ENTITY_APPLICATION_SETTINGS
        )

        index = Index(data_source_id=data_source_id)

        document: Union[Node, ListNode] = get_tree_node_by_nested_id(document_id=document_id, repository=repository)
        parent_node = DocumentNode(
            uid=parent_id, type="FAKENODE", data_source_id=data_source_id, name="FAKENODE", menu_items=[],
        )
        try:
            extend_index_with_node_tree(
                tree_node=document, data_source_id=data_source_id, parent=parent_node, app_settings=app_settings
            )
        except Exception as error:
            logger.exception(error)
            get_error_node(tree_node=document, parent_node=parent_node, data_source_id=data_source_id)
            logger.warning(f"Caught error while processing document {document.name}: {error}")

        for node in PreOrderIter(parent_node):
            index.add(node.to_node())

        index_dict = index.to_dict()
        del index_dict[parent_id]

        return index_dict

from typing import Dict, Union

from config import config
from domain_classes.blueprint_attribute import BlueprintAttribute
from domain_classes.recipe import Recipe, RecipePlugin
from domain_classes.tree_node import ListNode, Node
from enums import BLUEPRINTS
from repository.repository_exceptions import ApplicationNotLoadedException, EntityNotFoundException
from restful import response_object
from restful.request_object import ValidRequestObject
from restful.response_object import ResponseSuccess
from restful.use_case import UseCase
from services.dmss import get_root_packages
from services.document_service import DocumentService
from use_case.utils.index_menu_actions import get_node_fetch, get_node_index
from use_case.utils.set_index_context_menu import create_context_menu
from utils.logging import logger


def get_parent_id(data_source_id: str, node: Union[Node, ListNode]):
    if node.parent:
        # Adjust parent, since we skipped content node
        if node.parent.parent and node.parent.parent.type == BLUEPRINTS.PACKAGE.value:
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
    if node.type == BLUEPRINTS.PACKAGE.value:
        # Skip content node
        if node.has_children():
            # Content node is always the only node in package
            content_node = node.children[0]
            children = [child.node_id for child in content_node.children if is_visible(child)]
    else:
        children = [child.node_id for child in node.children if is_visible(child)]
    is_root_package = node.type == BLUEPRINTS.PACKAGE.value and node.entity.get("isRoot")
    return {
        "parentId": get_parent_id(data_source_id, node),
        "title": node.name,
        "id": node.node_id,
        "nodeType": "document-node" if node.type != BLUEPRINTS.PACKAGE.value else BLUEPRINTS.PACKAGE.value,
        "children": children,
        "type": node.type,
        "meta": {
            "menuItems": menu_items,
            "treePath": node.tree_id if not is_root_package else node.node_id,
            "fetchUrl": get_node_fetch(data_source_id, node) if node.is_single() else {},
            "indexUrl": get_node_index(data_source_id, node),
            "error": False,
            "isRootPackage": is_root_package,
            "isList": node.is_array(),
            "dataSource": data_source_id,
            "empty": node.is_empty(),
            "hasCustomAction": node.type in [e["input"] for e in app_settings.get("actions", [])],
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

    ui_recipe: Recipe = node.parent.blueprint.get_ui_recipe_by_plugin(name="INDEX")
    return ui_recipe.is_contained(node.attribute, RecipePlugin.INDEX)


def extend_index_with_node_tree(
    root: Union[Node, ListNode], data_source_id: str, app_settings: dict, traverse_depth: int = 999
):
    index = {}

    for node in root.traverse(depth_limit=traverse_depth):
        try:
            # Skip package's content node
            if node.parent and node.parent.type == BLUEPRINTS.PACKAGE.value:
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


# TODO: Combine these two useCases, with and optional "parentId" arg
class GenerateIndexRequestObject(ValidRequestObject):
    def __init__(self, data_source_id: str, application: str):
        self.data_source_id: str = data_source_id
        self.application: str = application


class GenerateIndexUseCase(UseCase):
    @staticmethod
    def process_request(request: GenerateIndexRequestObject) -> ResponseSuccess:
        data_source_id = request.data_source_id
        application = request.application
        document_service = DocumentService()
        app_settings = config.APP_SETTINGS.get(application)
        if not app_settings:
            raise ApplicationNotLoadedException(application)
        root_packages = get_root_packages(data_source_id)

        root = Node(
            key="root",
            uid=data_source_id,
            entity={"type": "datasource", "name": data_source_id},
            blueprint_provider=document_service.blueprint_provider,
            attribute=BlueprintAttribute("root", "datasource", contained=False),
        )
        for root_package in root_packages:
            try:
                root_package_node = document_service.get_node_by_uid(
                    data_source_id=data_source_id, document_uid=root_package["_id"], depth=0
                )
                root_package_node.key = root_package_node.uid
                root.add_child(root_package_node)
            except EntityNotFoundException as error:
                logger.exception(error)
                error_node: Node = Node(
                    key=root_package["_id"],
                    uid=root_package["_id"],
                    entity={"name": root_package["name"], "type": ""},
                    blueprint_provider=document_service.get_blueprint,
                    attribute=BlueprintAttribute("root", "datasource"),
                )
                error_node.set_error(f"failed to add root package {root_package['name']} to the root node")
                root.add_child(error_node)
            except Exception as error:
                logger.exception(f"{error}, unhandled exception.")

        # This traverse depth will only fetch index of root-packages
        result = extend_index_with_node_tree(root, data_source_id, app_settings, traverse_depth=2)
        return response_object.ResponseSuccess(result)


class GenerateSingleIndexRequestObject(ValidRequestObject):
    def __init__(self, data_source_id: str, application: str, document_id: str, parent_id: str):
        self.data_source_id: str = data_source_id
        self.application: str = application
        self.document_id: str = document_id
        self.parent_id: str = parent_id


class GenerateSingleIndexUseCase(UseCase):
    @staticmethod
    def process_request(req: GenerateSingleIndexRequestObject) -> ResponseSuccess:
        data_source_id = req.data_source_id
        document_id = req.document_id
        parent_id = req.parent_id
        application = req.application
        document_service = DocumentService()

        app_settings = config.APP_SETTINGS.get(application)
        if not app_settings:
            raise ApplicationNotLoadedException(application)
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
                document_service.get_node_by_uid(data_source_id=data_source_id, document_uid=document_id, depth=1)
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
                entity={"name": document_id, "type": BLUEPRINTS.ENTITY.value, "_id": document_id},
                blueprint_provider=document_service.get_blueprint,
                attribute=BlueprintAttribute("error", BLUEPRINTS.ENTITY.value),
            )
            node.set_error(f"failed to create node '{document_id}' on '{parent.name}'")
        result = extend_index_with_node_tree(node, data_source_id, app_settings, traverse_depth=3)
        return response_object.ResponseSuccess(result)

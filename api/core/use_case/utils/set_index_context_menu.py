from typing import Union

from classes.index_v2 import DocumentNode
from classes.tree_node import ListNode, Node
from core.enums import DMT, SIMOS
from core.use_case.utils.generate_index_menu_actions_v2 import (
    get_delete_menu_item,
    get_download_menu_action,
    get_dynamic_create_menu_item,
    get_export_menu_item,
    get_import_menu_item,
    get_rename_menu_action,
    get_runnable_menu_action,
)
from core.utility import get_blueprint
from utils.group_by import group_by


def set_index_context_menu(
    tree_node: Union[Node, ListNode],
    index_node: DocumentNode,
    data_source_id: str,
    app_settings: dict,
    parent: DocumentNode,
    is_root_package: bool,
    is_package_content: bool,
):
    create_new_menu_items = []
    is_list_node = isinstance(tree_node, ListNode)

    # If the node is a DMT Package it get's some special context menu entries
    if tree_node.type == DMT.PACKAGE.value:
        # if is_package := tree_node.type == DMT.PACKAGE.value:
        # Packages should not open a tab on click
        index_node.on_select = {}

        # Context menu: New Package
        create_new_menu_items.append(
            get_dynamic_create_menu_item(
                data_source_id=data_source_id, name="Package", type=DMT.PACKAGE.value, node_id=tree_node.node_id,
            )
        )
        # Context menu: New from app_settings
        for model in app_settings["models"]:
            # TODO: Costly way to just get a name...
            model_blueprint = get_blueprint(model)
            create_new_menu_items.append(
                get_dynamic_create_menu_item(
                    data_source_id=data_source_id, name=model_blueprint.name, type=model, node_id=tree_node.node_id,
                )
            )
    else:
        # If it's not a package, but a ListNode
        if is_list_node:
            # Set Package isList attribute
            index_node.is_list = True
            # List nodes can always append entities of it's own type
            create_new_menu_items.append(
                get_dynamic_create_menu_item(
                    data_source_id=data_source_id,
                    name=f"Create  {tree_node.name}",
                    type=tree_node.type,
                    node_id=tree_node.node_id,
                )
            )

    # Every node gets an delete and rename action
    index_node.menu_items.append(
        get_rename_menu_action(
            data_source_id=data_source_id,
            document_id=tree_node.node_id,
            type=tree_node.type,
            is_package_content=is_package_content,
            parent_id=parent.uid if not is_root_package else None,
        )
    )
    index_node.menu_items.append(
        get_delete_menu_item(
            data_source_id,
            parent_id=parent.uid if not is_root_package else None,
            document_id=tree_node.node_id,
            is_package_content=is_package_content,
        )
    )

    # Runnable entities gets custom actions
    action_types = group_by(
        items=app_settings["actions"], grouping_function=lambda runnable: runnable.get("input", ""),
    )

    if tree_node.type in action_types:
        action_items = []

        for action in action_types[tree_node.type]:
            action_items.append(
                get_runnable_menu_action(data_source_id=data_source_id, document_id=tree_node.node_id, runnable=action)
            )
        index_node.menu_items.append({"label": "Actions", "menuItems": action_items})

    # Applications can be downloaded
    if tree_node.type == SIMOS.APPLICATION.value:
        index_node.menu_items.append(get_download_menu_action(data_source_id, tree_node.node_id))

    # If it's a root package we need some more
    if is_root_package:
        # Set Package isRoot attribute
        index_node.is_root_package = True
        # Context menu: Export
        index_node.menu_items.append(
            get_export_menu_item(
                data_source_id=data_source_id, document_id=tree_node.node_id, is_package_content=is_package_content
            )
        )
        # Context menu: Import
        index_node.menu_items.append(
            get_import_menu_item(
                data_source_id=data_source_id, document_id=tree_node.node_id, is_package_content=is_package_content
            )
        )

    if create_new_menu_items:
        index_node.menu_items.append({"label": "New", "menuItems": create_new_menu_items})
    index_node.sort_menu_items()

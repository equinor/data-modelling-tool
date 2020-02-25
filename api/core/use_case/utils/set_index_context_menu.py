from classes.tree_node import Node
from core.enums import DMT, SIMOS
from core.use_case.utils.generate_index_menu_actions import (
    get_create_reference_menu_item,
    get_create_root_package_menu_item,
    get_delete_menu_item,
    get_download_menu_action,
    get_dynamic_create_menu_item,
    get_export_menu_item,
    get_import_menu_item,
    get_rename_menu_action,
    get_runnable_menu_action,
)
from core.use_case.utils.sort_menu_items import sort_menu_items
from utils.group_by import group_by


def create_context_menu(node: Node, data_source_id: str, app_settings: dict):
    menu_items = []
    create_new_menu_items = []
    is_package = node.type == DMT.PACKAGE.value

    # Add create entry for optional attributes
    for empty_child in [child for child in node.children if child.is_empty()]:
        create_new_menu_items.append(
            get_dynamic_create_menu_item(
                data_source_id=data_source_id,
                name=empty_child.name,
                type=empty_child.type,
                node_id=empty_child.node_id,
                label=f"Create {empty_child.name}",
            )
        )

    # Datasource Node can only add root-packages
    if node.type == "datasource":
        menu_items.append(get_create_root_package_menu_item(data_source_id))
    else:
        # If the node is a DMT Package it get's some special context menu entries
        if is_package:
            node_id = f"{node.node_id}.content"
            # Context menu: New Package
            create_new_menu_items.append(
                get_dynamic_create_menu_item(
                    data_source_id=data_source_id, name="Package", type=DMT.PACKAGE.value, node_id=node_id
                )
            )
            # Context menu: New from app_settings
            for model in app_settings["models"]:
                create_new_menu_items.append(
                    get_dynamic_create_menu_item(
                        data_source_id=data_source_id, name=model.split("/")[-1], type=model, node_id=node_id
                    )
                )
        else:
            # Add create entry for optional attributes (not for packages)
            for empty_child in [child for child in node.children if child.is_empty()]:
                create_new_menu_items.append(
                    get_dynamic_create_menu_item(
                        data_source_id=data_source_id,
                        name=empty_child.name,
                        type=empty_child.type,
                        node_id=empty_child.node_id,
                        label=f"Create {empty_child.name}",
                    )
                )
            if node.is_array():
                # List nodes can always append entities of it's own type
                create_new_menu_items.append(
                    get_dynamic_create_menu_item(
                        data_source_id=data_source_id, name=f"Create {node.name}", type=node.type, node_id=node.node_id
                    )
                )
                # If the attribute is not storageContained, offer choice to insert a reference to existing entity
                if not node.attribute_is_contained():
                    create_new_menu_items.append(
                        get_create_reference_menu_item(
                            data_source_id=data_source_id, type=node.type, node_id=node.node_id
                        )
                    )

        menu_items.append(
            get_rename_menu_action(
                data_source_id=data_source_id,
                dotted_document_id=node.node_id,
                type=node.type,
                parent_uid=node.parent.node_id if node.parent and node.parent.type != "datasource" else None,
            )
        )
        is_removable = True

        # type can be datasource, entities etc
        if node.parent is not None and node.parent.type != "datasource":
            is_removable = node.is_array() or node.attribute.is_optional()

        if is_removable:
            menu_items.append(
                get_delete_menu_item(
                    data_source_id,
                    parent_id=node.parent.node_id if node.parent and node.parent.type != "datasource" else None,
                    document_id=node.node_id,
                    is_package_content=is_package,
                )
            )

        # Runnable entities gets custom actions
        action_types = group_by(
            items=app_settings["actions"], grouping_function=lambda runnable: runnable.get("input", "")
        )

        if node.type in action_types:
            action_items = []

            for action in action_types[node.type]:
                action_items.append(
                    get_runnable_menu_action(data_source_id=data_source_id, document_id=node.node_id, runnable=action)
                )
            menu_items.append({"label": "Actions", "menuItems": action_items})

        # Applications can be downloaded
        if node.type == SIMOS.APPLICATION.value:
            menu_items.append(get_download_menu_action(data_source_id, node.node_id))

        is_root_package = node.is_single() and node.is_root()

        # If it's a root package we need some more
        if is_root_package:
            # Context menu: Export
            menu_items.append(
                get_export_menu_item(
                    data_source_id=data_source_id, document_id=node.node_id, is_package_content=is_package
                )
            )
            # Context menu: Import
            menu_items.append(
                get_import_menu_item(
                    data_source_id=data_source_id, document_id=node.node_id, is_package_content=is_package
                )
            )

        if create_new_menu_items:
            menu_items.append({"label": "New", "menuItems": create_new_menu_items})

    sort_menu_items(menu_items)

    return menu_items

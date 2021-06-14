from domain_classes.tree_node import Node
from enums import BLUEPRINTS, SIMOS
from use_case.utils.index_menu_actions import (
    get_create_reference_menu_item,
    get_create_root_package_menu_item,
    get_delete_menu_item,
    get_download_menu_action,
    get_dynamic_create_menu_item,
    get_export_code_menu_item,
    get_export_menu_item,
    get_import_menu_item,
    get_rename_menu_action,
    get_runnable_menu_action,
)
from use_case.utils.sort_menu_items import sort_menu_items
from utils.group_by import group_by


def create_context_menu(node: Node, data_source_id: str, app_settings: dict):
    menu_items = []
    create_new_menu_items = []
    new_reference_menu_items = []
    is_package = node.type == BLUEPRINTS.PACKAGE.value

    # DataSource Node can only add root-packages
    if node.type == "datasource":
        menu_items.append(get_create_root_package_menu_item(data_source_id))
    else:
        # If the node is a DMT Package it get's some special context menu entries
        if is_package:
            node_id = f"{node.node_id}.content"
            # Context menu: New Package
            create_new_menu_items.append(
                get_dynamic_create_menu_item(
                    data_source_id=data_source_id, name="Package", type=BLUEPRINTS.PACKAGE.value, node_id=node_id
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
            if node.is_array():
                # List nodes can always append entities of it's own type
                create_new_menu_items.append(
                    get_dynamic_create_menu_item(
                        data_source_id=data_source_id, name=node.name, type=node.type, node_id=node.node_id
                    )
                )
            else:
                # Add create entry for optional attributes (not for packages)
                for empty_child in [child for child in node.children if child.is_empty() and not child.is_array()]:
                    # If the attribute is not contained, offer choice to insert a
                    # reference to existing entity, else, create new inside
                    if not empty_child.storage_contained():
                        new_reference_menu_items.append(
                            get_create_reference_menu_item(type=empty_child.type, node_id=empty_child.node_id)
                        )
                    else:
                        create_new_menu_items.append(
                            get_dynamic_create_menu_item(
                                data_source_id=data_source_id,
                                name=empty_child.name,
                                type=empty_child.type,
                                node_id=empty_child.node_id,
                                label=empty_child.name,
                            )
                        )
        # Everything besides listNodes can be renamed. Could be supported in future.
        if not node.is_array():
            parent_uid = node.parent.node_id if node.parent and node.parent.type != "datasource" else node.parent.name
            menu_items.append(
                get_rename_menu_action(
                    data_source_id=data_source_id,
                    dotted_document_id=node.node_id,
                    type=node.type,
                    parent_uid=parent_uid,
                    parent_type=node.parent.type,
                )
            )
        is_removable = True

        # type can be datasource, entities etc
        if node.parent is not None and node.parent.type != "datasource":
            is_removable = node.is_array() or node.attribute.is_optional() or node.parent.is_array()

        if is_removable:
            # If the document is not in a package, and not contained, remove the reference instead of deleting it
            if not node.contained() and node.parent.type != BLUEPRINTS.ENTITY.value:
                menu_items.append(
                    {"label": "Remove reference", "action": "UNLINK", "data": f"{node.parent.uid}.{node.key}"}
                )
            else:
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

        # Generate code
        if node.type in [SIMOS.BLUEPRINT.value, BLUEPRINTS.PACKAGE.value]:
            # Context menu: Export code
            code_generators = []
            # Add any code generators added as plugins
            for generator in app_settings.get("code_generators", []):
                path = node.filesystem_path()
                path_wo_data_source = path.split("/", 1)[1]
                code_generators.append(get_export_code_menu_item(data_source_id, generator, path_wo_data_source))
            if code_generators:
                menu_items.append({"label": "Generate Code", "menuItems": code_generators})

        is_root_package = node.is_single() and node.type == BLUEPRINTS.PACKAGE.value

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
        if new_reference_menu_items:
            menu_items.append({"label": "New reference", "menuItems": new_reference_menu_items})

    sort_menu_items(menu_items)

    return menu_items

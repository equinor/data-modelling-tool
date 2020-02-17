from typing import Union

from classes.tree_node import Node
from core.enums import DMT


def get_rename_menu_action(data_source_id: str, dotted_document_id: str, type: str, parent_uid: str = None):
    parent_uid = parent_uid.split(".")[0] if parent_uid else None
    document_split = dotted_document_id.split(".", 1)
    attribute_arg = f"?attribute={document_split[1]}" if len(document_split) > 1 else ""

    return {
        "label": "Rename",
        "action": "UPDATE",
        "data": {
            "dataUrl": f"/api/v2/documents/{data_source_id}/{document_split[0]}{attribute_arg}",
            "url": f"/api/v2/explorer/{data_source_id}/rename",
            "schemaUrl": f"/api/v2/json-schema/{type}?ui_recipe=DEFAULT_CREATE",
            # TODO: This is not right...
            "nodeUrl": f"/api/v4/index/{data_source_id}/{parent_uid if parent_uid else dotted_document_id}",
            "request": {
                "description": "${description}",
                "parentId": parent_uid,
                "name": "${name}",
                "documentId": dotted_document_id,
            },
        },
    }


def get_delete_menu_item(
    data_source_id: str, document_id: str, parent_id: str = None, is_package_content: bool = False
):
    if is_package_content:
        document_id = document_id.split(".")[0]
    return {
        "label": "Remove",
        "action": "DELETE",
        "data": {
            "url": f"/api/v4/explorer/{data_source_id}/remove",
            "request": {"parentId": parent_id, "documentId": document_id},
        },
    }


def get_dynamic_create_menu_item(data_source_id: str, name: str, type: str, node_id: str = None):
    node_id_split = node_id.split(".", 1)
    return {
        "label": f"{name}",
        "action": "CREATE",
        "data": {
            "url": f"/api/v2/explorer/{data_source_id}/add-file",
            "schemaUrl": f"/api/v2/json-schema/{type}?ui_recipe=DEFAULT_CREATE",
            "nodeUrl": f"/api/v4/index/{data_source_id}/{node_id_split[0]}",
            "request": {
                "type": type,
                "parentId": node_id_split[0],
                "attribute": node_id_split[1] if len(node_id_split) > 1 else None,
                "name": "${name}",
                "description": "${description}",
            },
        },
    }


def get_create_root_package_menu_item(data_source_id: str):
    return {
        "label": "Create Root Package",
        "action": "CREATE",
        "data": {
            "url": f"/api/v2/explorer/{data_source_id}/add-root-package",
            "schemaUrl": f"/api/v2/json-schema/{DMT.PACKAGE.value}?ui_recipe=DEFAULT_CREATE",
            "nodeUrl": f"/api/v4/index/{data_source_id}/{data_source_id}",
            "request": {"type": DMT.PACKAGE.value, "name": "${name}", "description": "${description}"},
        },
    }


def get_runnable_menu_action(data_source_id: str, document_id: str, runnable: dict):
    return {
        "label": f"{runnable['name']}",
        "action": "RUNNABLE",
        "data": {
            "dataUrl": f"/api/v2/documents/{data_source_id}/{document_id}",
            "runnable": runnable,
            "documentId": document_id,
            "dataSourceId": data_source_id,
        },
    }


def get_download_menu_action(data_source_id: str, document_id: str):
    return {
        "label": "Create Application",
        "action": "DOWNLOAD",
        "data": {"url": f"/api/v2/system/{data_source_id}/create-application/{document_id}"},
    }


def get_node_on_select(data_source_id: str, tree_node: Union[Node]):
    split_node_id_attribute = tree_node.node_id.split(".", 1)
    attribute = f"?attribute={split_node_id_attribute[-1]}" if len(split_node_id_attribute) > 1 else ""
    return {
        "uid": tree_node.node_id,
        "title": tree_node.name,
        "component": "blueprint",
        "data": {
            "dataUrl": f"/api/v2/documents/{data_source_id}" f"/{split_node_id_attribute[0]}{attribute}",
            "schemaUrl": f"/api/v2/json-schema/{tree_node.type}",
        },
    }


def get_export_menu_item(data_source_id: str, document_id: str, is_package_content: bool):
    if is_package_content:
        document_id = document_id.split(".", 1)[0]
    return {
        "label": "Export",
        "action": "DOWNLOAD",
        "data": {
            "url": f"/api/v2/explorer/{data_source_id}/export/{document_id}",
            "prompt": {"title": "Export", "content": "Download the package"},
        },
    }


def get_import_menu_item(data_source_id: str, document_id: str, is_package_content: bool):
    if is_package_content:
        document_id = document_id.split(".", 1)[0]
    return {
        "label": "Import",
        "action": "IMPORT",
        "data": {
            "url": f"/api/v2/explorer/{data_source_id}/import/{document_id}",
            "schemaUrl": f"/api/v2/json-schema/system/DMT/actions/ImportAction",
            "prompt": {"title": "Export", "content": "Download the package"},
        },
    }

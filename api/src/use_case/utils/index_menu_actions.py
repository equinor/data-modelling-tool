from functools import lru_cache
from pathlib import Path
from typing import Union

from config import Config
from domain_classes.tree_node import Node
from enums import BLUEPRINTS

DMSS_API = "/dmss/api/v1"


def get_node_url(datasource, parent_id):
    return f"/api/v4/index/{datasource}/{parent_id}"


def get_rename_menu_action(
    data_source_id: str, dotted_document_id: str, type: str, parent_uid: str = None, parent_type: str = None
):
    parent_uid = parent_uid.split(".")[0] if parent_uid else None
    document_split = dotted_document_id.split(".", 1)
    attribute_arg = f"?attribute={document_split[1]}" if len(document_split) > 1 else ""

    return {
        "label": "Rename",
        "action": "UPDATE",
        "data": {
            "dataUrl": f"/api/v2/documents/{data_source_id}/{document_split[0]}{attribute_arg}",
            "url": f"{DMSS_API}/explorer/{data_source_id}/rename",
            "nodeUrl": get_node_url(data_source_id, parent_uid if parent_uid else dotted_document_id),
            "request": {
                "description": "${description}",
                "parentId": parent_uid if parent_type != "datasource" else None,
                "name": "${name}",
                "documentId": dotted_document_id,
            },
        },
    }


def get_delete_menu_item():
    return {
        "label": "Remove",
        "action": "DELETE",
        "data": {"url": f"{DMSS_API}/explorer/"},
    }


def get_dynamic_create_menu_item(data_source_id: str, name: str, type: str, node_id: str = None, label: str = None):
    node_id_split = node_id.split(".", 1)
    return {
        "label": label if label else name,
        "action": "CREATE",
        "data": {
            "url": f"{DMSS_API}/explorer/{data_source_id}/{node_id_split[0]}"
            + f"{'.' + node_id_split[1] if len(node_id_split) > 1 else ''}",
            "nodeUrl": get_node_url(data_source_id, node_id_split[0]),
            "request": {
                "type": type,
                "name": "${name}",
                "description": "${description}",
            },
        },
    }


def get_create_reference_menu_item(type: str, node_id: str = None):
    node_id_split = node_id.split(".", 1)
    return {
        "label": f"{type.split('/')[-1]}",
        "action": "INSERT_REFERENCE",
        "data": node_id_split[1] if len(node_id_split) > 1 else None,
    }


def get_change_acl_menu_item():
    return {"label": "Access control", "action": "CHANGE_ACL", "data": {}}


def get_create_root_package_menu_item(data_source_id: str):
    return {
        "label": "Create Root Package",
        "action": "CREATE",
        "data": {
            "url": f"{DMSS_API}/explorer/{data_source_id}",
            "nodeUrl": get_node_url(data_source_id, data_source_id),
            "request": {
                "name": "${name}",
                "description": "${description}",
                "type": BLUEPRINTS.PACKAGE.value,
                "isRoot": True,
            },
        },
    }


def get_download_menu_action(data_source_id: str, document_id: str):
    return {
        "label": "Create Application",
        "action": "DOWNLOAD",
        "data": {"url": f"/api/v2/system/{data_source_id}/create-application/{document_id}"},
    }


def get_node_index(data_source_id: str, tree_node: Union[Node]):
    if tree_node.type in ["datasource"]:
        return
    if tree_node.is_empty():
        return
    if len(tree_node.children) > 0:
        if tree_node.parent.type == BLUEPRINTS.ENTITY.value:
            return get_node_url(data_source_id, tree_node.parent.parent.node_id)
        return get_node_url(data_source_id, tree_node.parent.node_id)


def get_node_fetch(data_source_id: str, tree_node: Union[Node]):
    if tree_node.type in ["datasource"]:
        return
    if tree_node.is_empty():
        return
    if tree_node.type == BLUEPRINTS.PACKAGE.value:
        return

    split_node_id_attribute = tree_node.node_id.split(".", 1)
    attribute = f"?attribute={split_node_id_attribute[-1]}" if len(split_node_id_attribute) > 1 else ""
    return {
        "uid": tree_node.node_id,
        "title": tree_node.name,
        "component": "blueprint",
        "data": {"dataUrl": f"/api/v2/documents/{data_source_id}" f"/{split_node_id_attribute[0]}{attribute}"},
    }


def get_export_menu_item(data_source_id: str, document_id: str, is_package_content: bool):
    if is_package_content:
        document_id = document_id.split(".", 1)[0]
    return {
        "label": "Export",
        "action": "DOWNLOAD",
        "data": {
            "url": f"{DMSS_API}/export/{data_source_id}/{document_id}",
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
            "prompt": {"title": "Export", "content": "Download the package"},
        },
    }


def get_export_code_menu_item(data_source_id, plugin_name, document_path: str):
    return {
        "label": _get_plugin_label(plugin_name),
        "action": "DOWNLOAD",
        "data": {
            "url": f"/api/system/{data_source_id}/generate-code/{plugin_name}/{document_path}",
            "prompt": {"title": "Download", "content": f"Download code generated by {plugin_name}"},
        },
    }


@lru_cache
def _get_plugin_label(plugin_name: str) -> str:
    name_path = Path(f"{Config.APPLICATION_HOME}/code_generators/{plugin_name}/NAME.txt")
    if name_path.exists():
        with open(name_path) as f:
            label = f.read().strip()
    else:
        label = f"{plugin_name} code generator"
    return label

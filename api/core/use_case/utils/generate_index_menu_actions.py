from typing import Union, Dict
from core.domain.models import Blueprint, Package
from core.domain.dto import DTO
from core.enums import DMT


def get_rename_document_menu_item(data_source_id: str, start_path: str, document: DTO):
    return {
        "label": "Rename",
        "action": "UPDATE",
        "data": {
            "url": f"/api/v2/explorer/move-file",
            "dataUrl": f"/api/v2/documents/{data_source_id}/{document.uid}",
            "schemaUrl": f"/api/v2/json-schema/system/DMT/actions/RenameAction",
            "request": {"source": f"{start_path}/{document.name}", "destination": f"{start_path}/" + "${name}"},
        },
    }


def get_rename_menu_action(
    data_source_id: str, document_id: str, type: str, name: str, parent_id: str, attribute: str = "content"
):
    return {
        "label": "Rename",
        "action": "UPDATE",
        "data": {
            "dataUrl": f"/api/v2/documents/{data_source_id}/{document_id}",
            "url": f"/api/v2/explorer/{data_source_id}/rename-file",
            "schemaUrl": f"/api/v2/json-schema/{type}?ui_recipe=DEFAULT_CREATE",
            "nodeUrl": f"/api/v3/index/{data_source_id}",
            "request": {
                "description": "${description}",
                "parentId": parent_id,
                "name": "${name}",
                "documentId": document_id,
                "attribute": attribute,
            },
        },
    }


def get_delete_document_menu_item(data_source_id: str, parent_id: str, parent_attribute: str, document_id: str):
    return {
        "label": "Remove",
        "action": "DELETE",
        "data": {
            "url": f"/api/v2/explorer/{data_source_id}/remove-file",
            "prompt": {"title": "Are you sure?", "content": "Would you like to remove this item?"},
            "request": {"parentId": parent_id, "documentId": document_id, "attribute": parent_attribute},
        },
    }


def get_remove_attribute_menu_item(data_source_id: str, parent_id: str, attribute: str):
    return {
        "label": "Remove",
        "action": "DELETE",
        "data": {
            "url": f"/api/v2/explorer/{data_source_id}/remove-attribute",
            "prompt": {"title": "Are you sure?", "content": "Would you like to remove this item?"},
            "request": {"parentId": parent_id, "attribute": attribute},
        },
    }


def get_rename_attribute_menu_action(data_source_id: str, parent_id: str, type: str, name: str, attribute: str):
    return {
        "label": "Rename",
        "action": "UPDATE",
        "data": {
            "dataUrl": f"/api/v2/documents/{data_source_id}/{parent_id}?attribute={attribute}",
            "url": f"/api/v2/explorer/{data_source_id}/rename-attribute",
            "schemaUrl": f"/api/v2/json-schema/{type}?ui_recipe=DEFAULT_CREATE",
            "nodeUrl": f"/api/v3/index/{data_source_id}/attribute/{name}",
            "request": {
                "description": "${description}",
                "parentId": parent_id,
                "name": "${name}",
                "attribute": attribute,
            },
        },
    }


def get_dynamic_create_menu_item(
    data_source_id: str, name: str, type: str, parent_id: str = None, attribute: str = "content"
):
    return {
        "label": f"{name}",
        "action": "CREATE",
        "data": {
            "url": f"/api/v2/explorer/{data_source_id}/add-file",
            "schemaUrl": f"/api/v2/json-schema/{type}?ui_recipe=DEFAULT_CREATE",
            "nodeUrl": f"/api/v3/index/{data_source_id}",
            "request": {
                "type": type,
                "parentId": parent_id,
                "attribute": attribute,
                "name": "${name}",
                "description": "${description}",
            },
        },
    }


def get_create_root_package_menu_item(data_source_id: str):
    return {
        "label": "Root Package",
        "action": "CREATE",
        "data": {
            "url": f"/api/v2/explorer/{data_source_id}/add-root-package",
            "schemaUrl": f"/api/v2/json-schema/{DMT.PACKAGE.value}?ui_recipe=DEFAULT_CREATE",
            "nodeUrl": f"/api/v3/index/{data_source_id}",
            "request": {"type": DMT.PACKAGE.value, "name": "${name}", "description": "${description}"},
        },
    }


def get_not_contained_menu_action(data_source_id: str, name: str, type: str, parent_id: str, data):
    return {
        "label": "New",
        "menuItems": [
            {
                "label": f"{type}",
                "action": "CREATE",
                "data": {
                    "url": f"/api/v2/explorer/{data_source_id}/add-file",
                    "schemaUrl": f"/api/v2/json-schema/{type}?ui_recipe=DEFAULT_CREATE",
                    "nodeUrl": f"/api/v3/index/{data_source_id}",
                    "request": {
                        "type": type,
                        "description": "${description}",
                        "parentId": parent_id,
                        "attribute": name,
                        "name": "${name}",
                        "data": data,
                    },
                },
            }
        ],
    }


def get_contained_menu_action(data_source_id: str, name: str, type: str, parent_id: str, data, node_id: str):
    return {
        "label": "New",
        "menuItems": [
            {
                "label": f"{type}",
                "action": "CREATE",
                "data": {
                    "url": f"/api/v2/explorer/{data_source_id}/add-file",
                    "schemaUrl": f"/api/v2/json-schema/{type}?ui_recipe=DEFAULT_CREATE",
                    "nodeUrl": f"/api/v3/index/{data_source_id}/attribute/{node_id}",
                    "request": {
                        "type": type,
                        "description": "${description}",
                        "parentId": parent_id,
                        "attribute": name,
                        "data": data,
                        "name": "${name}",
                    },
                },
            }
        ],
    }


def get_runnable_menu_action(data_source_id: str, document_id: str, runnable: dict):
    return {
        "label": f"{runnable['name']}",
        "action": "RUNNABLE",
        "data": {
            "dataUrl": f"/api/v2/documents/{data_source_id}/{document_id}",
            "prompt": {"title": f"{runnable['name']}", "content": f"{runnable['description']}"},
            "runnable": runnable,
            "documentId": document_id,
            "dataSourceId": data_source_id,
        },
    }


def get_download_menu_action(data_source_id: str, document_id: str):
    return {
        "label": "Create Application",
        "action": "DOWNLOAD",
        "data": {
            "url": f"/api/v2/system/{data_source_id}/create-application/{document_id}",
            "prompt": {"title": "Create Application", "content": "Download the application"},
        },
    }


def get_node_on_select(data_source_id: str, document: DTO[Union[Blueprint, Package]]):
    return {
        "uid": document.uid,
        "title": document.name,
        "component": "blueprint",
        "data": {
            "dataUrl": f"/api/v2/documents/{data_source_id}/{document.uid}",
            "schemaUrl": f"/api/v2/json-schema/{document.type}",
        },
    }


def get_export_menu_item(data_source_id: str, document_id: str):
    return {
        "label": "Export",
        "action": "DOWNLOAD",
        "data": {
            "url": f"/api/v2/explorer/{data_source_id}/export/{document_id}",
            "prompt": {"title": "Export", "content": "Download the package"},
        },
    }


def get_import_menu_item(data_source_id: str, document_id: str):
    return {
        "label": "Import",
        "action": "IMPORT",
        "data": {
            "url": f"/api/v2/explorer/{data_source_id}/import/{document_id}",
            "schemaUrl": f"/api/v2/json-schema/system/DMT/actions/ImportAction",
            "prompt": {"title": "Export", "content": "Download the package"},
        },
    }

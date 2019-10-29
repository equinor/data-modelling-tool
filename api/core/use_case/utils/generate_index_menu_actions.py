from typing import Union

from flask import g

from core.domain.blueprint import Blueprint
from core.domain.package import Package
from core.enums import DMT


def get_update_document_menu_item(data_source_id: str, name: str, document_id: str):
    return {
        "label": "Rename",
        "action": "UPDATE",
        "data": {
            "url": f"/api/v2/explorer/move-file",
            "dataUrl": f"/api/v2/documents/{data_source_id}/{document_id}",
            "schemaUrl": f"/api/v2/json-schema/system/DMT/actions/RenameAction",
            "request": {"source": f"{data_source_id}/{name}", "destination": f"{data_source_id}/" + "${name}"},
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
            "request": {"type": type, "parentId": parent_id, "attribute": attribute, "name": "${name}"},
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
            "request": {"type": DMT.PACKAGE.value, "name": "${name}"},
        },
    }


def get_not_contained_menu_action(data_source_id: str, name: str, url_type: str, type: str, parent_id: str, data):
    return {
        "label": "New",
        "menuItems": [
            {
                "label": f"{name}",
                "action": "CREATE",
                "data": {
                    "url": f"/api/v2/explorer/{data_source_id}/{url_type}",
                    "schemaUrl": f"/api/v2/json-schema/{type}?ui_recipe=DEFAULT_CREATE",
                    "nodeUrl": f"/api/v3/index/{data_source_id}",
                    "request": {
                        "type": type,
                        "parentId": parent_id,
                        "attribute": name,
                        "name": "${name}",
                        "data": data,
                    },
                },
            }
        ],
    }


def get_contained_menu_action(data_source_id: str, name: str, url_type: str, type: str, parent_id: str, data):
    return {
        "label": "New",
        "menuItems": [
            {
                "label": f"{name}",
                "action": "CREATE",
                "data": {
                    "url": f"/api/v2/explorer/{data_source_id}/{url_type}",
                    "schemaUrl": f"/api/v2/json-schema/{type}?ui_recipe=DEFAULT_CREATE",
                    "request": {
                        "type": type,
                        "parentId": parent_id,
                        "attribute": name,
                        "data": data,
                        "name": "${name}",
                    },
                },
            }
        ],
    }


def get_runnable_menu_action(data_source_id: str, document_id: str):
    return {
        "label": f"Run {g.application_settings['runnable']['name']}",
        "action": "RUNNABLE",
        "data": {
            "prompt": {
                "title": f"{g.application_settings['runnable']['name']}",
                "content": f"{g.application_settings['runnable']['description']}",
            },
            "runnable": g.application_settings["runnable"],
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


def get_node_on_select(data_source_id: str, document: Union[Blueprint, Package]):
    return {
        "uid": document.uid,
        "title": document.name,
        "component": "blueprint",
        "data": {
            "dataUrl": f"/api/v2/documents/{data_source_id}/{document.uid}",
            "schemaUrl": f"/api/v2/json-schema/{document.type}",
        },
    }

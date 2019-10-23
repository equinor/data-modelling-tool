from utils.enums import DMT, SIMOS, DataSourceDocumentType


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


def get_package_create_package_menu_item(data_source_id: str, parent_id: str, data):
    return {
        "label": "Package",
        "action": "CREATE",
        "data": {
            "url": f"/api/v2/explorer/{data_source_id}/add-file",
            "schemaUrl": f"/api/v2/json-schema/{DMT.PACKAGE.value}?ui_recipe=DEFAULT_CREATE",
            "nodeUrl": f"/api/v3/index/{data_source_id}",
            "request": {
                "type": DMT.PACKAGE.value,
                "parentId": parent_id,
                "attribute": "content",
                "name": "${name}",
                "data": data,
            },
        },
    }


def get_package_create_document_menu_item(
    data_source_id: str, parent_id: str, document_type: DataSourceDocumentType, data
):
    if document_type == DataSourceDocumentType.BLUEPRINT:
        return {
            "label": "Blueprint",
            "action": "CREATE",
            "data": {
                "url": f"/api/v2/explorer/{data_source_id}/add-file",
                "schemaUrl": f"/api/v2/json-schema/{SIMOS.BLUEPRINT.value}?ui_recipe=DEFAULT_CREATE",
                "nodeUrl": f"/api/v3/index/{data_source_id}",
                "request": {
                    "type": SIMOS.BLUEPRINT.value,
                    "parentId": parent_id,
                    "attribute": "content",
                    "name": "${name}",
                    "data": data,
                },
            },
        }
    else:
        return {
            "label": "Entity",
            "action": "CREATE",
            "data": {
                "url": f"/api/v2/explorer/{data_source_id}/add-entity-file",
                "schemaUrl": f"/api/v2/json-schema/{DMT.ENTITY.value}?ui_recipe=DEFAULT_CREATE",
                "nodeUrl": f"/api/v3/index/{data_source_id}",
                "request": {
                    "type": DMT.ENTITY.value,
                    "parentId": parent_id,
                    "attribute": "content",
                    "name": "${name}",
                    "data": data,
                },
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

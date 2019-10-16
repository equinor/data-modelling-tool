from flask_restful import abort

from core.use_case.utils.get_template import get_blueprint
from core.shared.templates import TemplatesSIMOS


def get_common_keys(attribute):
    keys = {
        "type": attribute.get("type", "string"),
        # "unit": attribute.get("unit", "nil"),
        # "value": attribute.get("value", "nil"),
        # "dimensions": attribute.get("dimensions", ""),
    }

    if "labels" in attribute:
        keys["enum"] = attribute.get("values")
        keys["enumNames"] = attribute.get("labels")

    return keys


def dimensions_to_int(dimensions: list):
    # TODO: Add support for matrices
    if len(dimensions) > 1:
        abort(401, "Sorry, we dont support matrices")
    if not dimensions:
        return 0
    if dimensions[0] == "*":
        return -1
    try:
        return int(dimensions[0])
    except ValueError:
        return 0


def form_to_schema(form: dict):
    properties = {}

    if "attributes" not in form:
        return {}

    primitives = ["string", "number", "integer", "boolean", "enum"]
    # TODO: Only handles arrays, not matrices
    for attribute in form["attributes"]:
        if attribute["type"] in primitives:
            properties[attribute["name"]] = attribute

        elif attribute["type"] == TemplatesSIMOS.BLUEPRINT_ATTRIBUTE.value:
            blueprint = get_blueprint(attribute["type"])
            properties[attribute["name"]] = {"type": "array", "items": blueprint.attributes}
        else:
            if attribute.get("dimensions", "") == "*":
                properties[attribute["name"]] = {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "_id": {"type": "string", "title": "id"},
                            "name": {"type": "string", "title": "name"},
                        },
                    },
                }

    del form["attributes"]
    form["properties"] = properties

    return {"type": "object", "properties": properties}


def form_to_schema2(form: dict):
    properties = {}

    if "attributes" not in form:
        return {}

    primitives = ["string", "number", "integer", "boolean"]
    for attribute in form["attributes"]:
        if attribute["type"] in primitives:
            print(attribute)
            properties[attribute["name"]] = attribute

        else:
            blueprint = get_blueprint(attribute["type"])
            items = {"properties": {}}
            attributes = blueprint.attributes
            filtered_attributes = []
            for attr in attributes:
                if attr["type"] != "templates/SIMOS/Enum":
                    filtered_attributes.append(attr)
                    key = attr["name"]
                    items["properties"][key] = attr

            properties[attribute["name"]] = {"type": "array", "items": items}

    if "uiRecipes" in properties:
        properties.pop("uiRecipes")

    if "storageRecipes" in properties:
        properties.pop("storageRecipes")

    return {"type": "object", "properties": properties}

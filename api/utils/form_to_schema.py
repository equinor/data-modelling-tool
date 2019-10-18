from typing import List

from core.domain.blueprint import Blueprint
from core.use_case.utils.get_template import get_blueprint

PRIMITIVES = ["string", "number", "integer", "boolean"]


def find_attribute(name: str, attributes: List):
    return next((x for x in attributes if x["name"] == name), None)


def get_attribute_config(attribute):
    keys = {"type": attribute.get("type", "string")}

    if "default" in attribute:
        keys["default"] = attribute["default"]

    if "labels" in attribute:
        keys["enum"] = attribute.get("values")
        keys["enumNames"] = attribute.get("labels")

    return keys


def process_attributes(blueprint, parent_blueprint, ui_recipe):
    properties = {}

    nested_attributes = []
    for attribute in blueprint.attributes:
        attribute_name = attribute["name"]

        if "enum" in attribute:
            continue

        ui_attributes = [] if not ui_recipe else ui_recipe.get("attributes", [])
        ui_attribute = find_attribute(attribute_name, ui_attributes)
        if ui_attribute:
            is_contained = ui_attribute["contained"] if "contained" in ui_attribute else True
            if not is_contained:
                # Skip create schema if not contained
                continue

        if attribute["type"] in PRIMITIVES:
            properties[attribute_name] = get_attribute_config(attribute)
        else:
            nested_attributes.append(attribute["type"])

        for nested_type in nested_attributes:
            nested_blueprint = get_blueprint(nested_type)

            if parent_blueprint and nested_blueprint == parent_blueprint:
                continue

            attribute_ui_recipe = (
                find_attribute(ui_attribute.get("uiRecipe", ""), nested_blueprint.ui_recipes) if ui_attribute else None
            )
            if attribute.get("dimensions", "") == "*":
                properties[attribute_name] = {
                    "type": "array",
                    "items": process_attributes(nested_blueprint, blueprint, attribute_ui_recipe),
                }
            else:
                return process_attributes(nested_blueprint, blueprint, attribute_ui_recipe)

    return {"type": "object", "properties": properties}


def form_to_schema(blueprint: Blueprint, ui_recipe):
    return process_attributes(blueprint, None, ui_recipe)

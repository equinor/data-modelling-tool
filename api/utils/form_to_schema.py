from typing import List

from core.domain.blueprint import Blueprint
from core.domain.ui_recipe import UIRecipe
from core.use_case.utils.get_template import get_blueprint
from core.use_case.utils.get_ui_recipe import get_ui_recipe

PRIMITIVES = ["string", "number", "integer", "boolean"]


def find_attribute(name: str, attributes: List):
    return next((x for x in attributes if x["name"] == name), None)


def get_attribute_config(attribute):
    keys = {"type": attribute.get("type", "string")}

    if "default" in attribute:
        keys["default"] = attribute["default"]

    if "description" in attribute:
        keys["description"] = attribute["description"]

    if "labels" in attribute:
        keys["enum"] = attribute.get("values")
        keys["enumNames"] = attribute.get("labels")

    return keys


def process_attributes(blueprint, parent_blueprint, ui_recipe_name):
    properties = {}

    ui_recipe: UIRecipe = get_ui_recipe(blueprint, ui_recipe_name)

    nested_attributes = []
    for attribute in blueprint.attributes:
        attribute_name = attribute["name"]
        is_array = attribute.get("dimensions", "") == "*"

        if "enum" in attribute:
            continue

        is_contained = ui_recipe.is_contained(attribute)

        if not is_contained:
            continue

        if attribute["type"] in PRIMITIVES:
            attribute_config = get_attribute_config(attribute)
            properties[attribute_name] = (
                attribute_config if not is_array else {"type": "array", "items": attribute_config}
            )
        else:
            nested_attributes.append({"name": attribute_name, "type": attribute["type"], "is_array": is_array})

    for nested_type in nested_attributes:
        attribute_name = nested_type["name"]
        nested_blueprint = get_blueprint(nested_type["type"])

        if parent_blueprint and nested_blueprint == parent_blueprint:
            continue

        if nested_type["is_array"]:
            properties[attribute_name] = {
                "type": "array",
                "items": process_attributes(nested_blueprint, blueprint, ui_recipe_name),
            }
        else:
            properties[attribute_name] = process_attributes(nested_blueprint, blueprint, ui_recipe_name)

    return {"type": "object", "properties": properties}


def form_to_schema(blueprint: Blueprint, ui_recipe_name):
    return process_attributes(blueprint, None, ui_recipe_name)

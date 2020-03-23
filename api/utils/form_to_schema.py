from typing import Optional

from classes.blueprint import Blueprint
from classes.recipe import Recipe
from core.utility import get_blueprint_cached

from core.enums import PRIMITIVES


def process_attributes(blueprint: Blueprint, parent_blueprint: Optional[Blueprint], ui_recipe_name):
    properties = {}

    ui_recipe: Recipe = blueprint.get_ui_recipe(ui_recipe_name)

    nested_attributes = []
    for attribute in blueprint.attributes:
        attribute_name = attribute.name
        is_array = attribute.dimensions == "*"

        is_contained = ui_recipe.is_contained(attribute)

        if not is_contained:
            continue

        if attribute.attribute_type in PRIMITIVES:
            properties[attribute_name] = (
                attribute.to_json_schema() if not is_array else {"type": "array", "items": attribute.to_json_schema()}
            )
        else:
            nested_attributes.append(
                {
                    "name": attribute_name,
                    "type": attribute.attribute_type,
                    "is_array": is_array,
                    "optional": attribute.optional,
                }
            )

    for nested_type in nested_attributes:
        attribute_name = nested_type["name"]
        nested_blueprint = get_blueprint_cached(nested_type["type"])

        if parent_blueprint and nested_blueprint == parent_blueprint:
            continue

        if nested_type["is_array"] or nested_type["optional"]:
            continue

        properties[attribute_name] = process_attributes(nested_blueprint, blueprint, ui_recipe_name)
    return {"type": "object", "properties": properties}


def form_to_schema(blueprint: Blueprint, ui_recipe_name):
    return process_attributes(blueprint, None, ui_recipe_name)

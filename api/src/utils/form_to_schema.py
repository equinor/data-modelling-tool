from typing import Optional

from domain_classes.blueprint import Blueprint
from domain_classes.recipe import Recipe
from utils.blueprint_provider import BlueprintProvider


def process_attributes(blueprint: Blueprint, parent_blueprint: Optional[Blueprint], ui_recipe_name):
    properties = {}
    ui_recipe: Recipe = blueprint.get_ui_recipe(ui_recipe_name)
    nested_attributes = []
    blueprint_provider = BlueprintProvider()

    for attribute in blueprint.attributes:

        if not ui_recipe.is_contained(attribute):
            continue

        if attribute.is_primitive():
            properties[attribute.name] = (
                attribute.to_json_schema()
                if not attribute.is_array()
                else {"type": "array", "items": attribute.to_json_schema()}
            )
        else:
            nested_attributes.append(
                {
                    "name": attribute.name,
                    "type": attribute.attribute_type,
                    "is_array": attribute.is_array(),
                    "optional": attribute.optional,
                }
            )

    for nested_type in nested_attributes:
        nested_blueprint = blueprint_provider.get_blueprint(nested_type["type"])

        if parent_blueprint and nested_blueprint == parent_blueprint:
            continue

        if nested_type["is_array"] or nested_type["optional"]:
            continue

        properties[nested_type["name"]] = process_attributes(nested_blueprint, blueprint, ui_recipe_name)
    return {"type": "object", "properties": properties}


def form_to_schema(blueprint: Blueprint, ui_recipe_name):
    return process_attributes(blueprint, None, ui_recipe_name)

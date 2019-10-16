from typing import List

from core.use_case.utils.get_template import get_blueprint

PRIMITIVES = ["string", "number", "integer", "boolean"]


def find_attribute(name: str, attributes: List):
    return next((x for x in attributes if x["name"] == name), None)


def get_attribute_config(attribute):
    if "widget" in attribute:
        return {"ui:widget": attribute["widget"]}
    if "field" in attribute:
        return {"ui:field": attribute["field"]}


def process_attributes(attribute_name: str, attribute_type: str, attribute_dimensions: str, ui_attributes):
    result = {}

    if not ui_attributes:
        return {}

    attribute_instance = find_attribute(attribute_name, ui_attributes)

    if not attribute_instance:
        return {}

    if "options" in attribute_instance:
        result["ui:options"] = attribute_instance["options"]

    if attribute_type in PRIMITIVES:
        return get_attribute_config(attribute_instance)
    else:
        blueprint = get_blueprint(attribute_type)
        if attribute_dimensions == "*":
            attribute_ui_recipe = find_attribute(attribute_instance["uiRecipe"], blueprint.ui_recipes)
            if attribute_ui_recipe:
                result["items"] = process_ui_recipe(attribute_ui_recipe, blueprint.attributes)
    return result


def process_ui_recipe(ui_recipe, attributes):
    setting = {}

    if "field" in ui_recipe:
        return {"ui:field": ui_recipe["field"]}

    for attribute in attributes:
        result = process_attributes(
            attribute["name"], attribute["type"], attribute.get("dimensions", ""), ui_recipe.get("attributes", None)
        )
        if result:
            setting[attribute["name"]] = result

    return setting


def form_to_ui_schema(blueprint):
    result = {}

    for ui_recipe in blueprint.ui_recipes:
        ui_schema = process_ui_recipe(ui_recipe, blueprint.attributes)
        if ui_schema:
            result[ui_recipe["name"]] = ui_schema

    return result

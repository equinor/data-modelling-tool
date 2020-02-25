from typing import List

from core.utility import get_blueprint_cached
from utils.data_structure.find import get

from core.enums import PRIMITIVES


def find_attribute(name: str, attributes: List):
    return next((x for x in attributes if x.name == name), None)


def get_attribute_config(attribute):
    config = {}

    if disabled := get(attribute, "disabled", default=False):
        config["ui:readonly"] = disabled
    if widget := get(attribute, "widget", default=False):
        config["ui:widget"] = widget
    if field := get(attribute, "field", default=False):
        config["ui:field"] = field
        if field == "collapsible":
            config["collapse"] = {"field": "ObjectField"}
    return config


def process_attributes(attribute_name: str, attribute_type: str, attribute_dimensions: str, ui_attributes):
    result = {}

    if not ui_attributes:
        return {}

    ui_attribute = find_attribute(attribute_name, ui_attributes.values())

    if not ui_attribute:
        return {}

    options = {}
    for option in get(ui_attribute, "options", default=[]):
        option_name = get(option, "name")
        if option_name in ["orderable"]:
            value = get(option, "value")
            value = {"false": False, "true": True}[value.lower()]
            options[option_name] = value
    result["ui:options"] = options

    if attribute_type in PRIMITIVES:
        return get_attribute_config(ui_attribute)
    else:
        blueprint = get_blueprint_cached(attribute_type)
        if attribute_dimensions == "*":
            if field := get(ui_attribute, "field", default=None):
                result["ui:field"] = field
                if field == "collapsible":
                    result["collapse"] = {"field": "ArrayField"}
            attribute_ui_recipe = blueprint.get_ui_recipe(get(ui_attribute, "ui_recipe", default=""))
            if attribute_ui_recipe:
                result["items"] = process_ui_recipe(attribute_ui_recipe, blueprint.attributes)
    return result


def process_ui_recipe(ui_recipe, attributes):
    if field := get(ui_recipe, "field", default=None):
        return {"ui:field": field}

    if plugin := get(ui_recipe, "plugin", default=None):
        return {"plugin": plugin}

    setting = {}
    for attribute in attributes:
        name = attribute.name
        result = process_attributes(name, attribute.attribute_type, attribute.dimensions, ui_recipe.ui_attributes)
        setting[name] = result

    return setting


def form_to_ui_schema(blueprint, ui_recipe_name=None):
    result = {}

    if ui_recipe_name:
        result[ui_recipe_name] = process_ui_recipe(blueprint.get_ui_recipe(ui_recipe_name), blueprint.attributes)
    else:
        for ui_recipe in blueprint.ui_recipes:
            result[get(ui_recipe, "name")] = process_ui_recipe(ui_recipe, blueprint.attributes)

    return result

from typing import List

from classes.blueprint import get_ui_recipe_from_blueprint
from core.use_case.utils.get_blueprint import get_blueprint
from utils.data_structure.find import get

PRIMITIVES = ["string", "number", "integer", "boolean"]


def find_attribute(name: str, attributes: List):
    return next((x for x in attributes if get(x, "name") == name), None)


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

    ui_attribute = find_attribute(attribute_name, ui_attributes)

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
        blueprint = get_blueprint(attribute_type)
        if attribute_dimensions == "*":
            if field := get(ui_attribute, "field", default=None):
                result["ui:field"] = field
                if field == "collapsible":
                    result["collapse"] = {"field": "ArrayField"}
            attribute_ui_recipe = find_attribute(get(ui_attribute, "ui_recipe", default=""), blueprint.ui_recipes)
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
        result = process_attributes(name, attribute.type, attribute.dimensions, ui_recipe.get("attributes"))
        setting[name] = result

    return setting


DEFAULT_PREVIEW_UI_RECIPE = {
    "type": "system/SIMOS/UiRecipe",
    "name": "PREVIEW",
    "description": "",
    "plugin": "PREVIEW",
    "attributes": [],
}

DEFAULT_EDIT_UI_RECIPE = {"type": "system/SIMOS/UiRecipe", "name": "EDIT", "description": "", "attributes": []}

DEFAULT_CREATE_UI_RECIPE = {
    "type": "system/SIMOS/UIRecipe",
    "name": "DEFAULT_CREATE",
    "description": "",
    "attributes": [],
}


def form_to_ui_schema(blueprint, ui_recipe_name=None):
    result = {}

    ui_recipes = blueprint.ui_recipes.copy()

    if not find_attribute("DEFAULT_CREATE", ui_recipes):
        ui_recipe = DEFAULT_CREATE_UI_RECIPE
        is_contained = ["name", "description"]
        attributes = []
        for attribute in [attr for attr in blueprint.attributes if attr.name not in is_contained]:
            attributes.append({"name": attribute.name, "contained": False})
        ui_recipe["attributes"] = attributes
        ui_recipes.append(ui_recipe)

    if not find_attribute("PREVIEW", ui_recipes):
        ui_recipes.append(DEFAULT_PREVIEW_UI_RECIPE)

    if not find_attribute("EDIT", ui_recipes):
        # TODO: Set default widget types for attributes
        ui_recipes.append(DEFAULT_EDIT_UI_RECIPE)

    if ui_recipe_name:
        result[ui_recipe_name] = process_ui_recipe(
            get_ui_recipe_from_blueprint(blueprint, ui_recipe_name), blueprint.attributes
        )
    else:
        for ui_recipe in ui_recipes:
            result[get(ui_recipe, "name")] = process_ui_recipe(ui_recipe, blueprint.attributes)

    return result

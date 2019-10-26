from typing import List

from core.use_case.utils.get_template import get_blueprint

PRIMITIVES = ["string", "number", "integer", "boolean"]


def find_attribute(name: str, attributes: List):
    return next((x for x in attributes if x["name"] == name), None)


def get_attribute_config(attribute):
    print(attribute)
    if "widget" in attribute:
        return {"ui:widget": attribute["widget"]}
    if "field" in attribute:
        result = {"ui:field": attribute["field"]}
        if attribute["field"] == "collapsible":
            result["collapse"] = {"field": "ObjectField"}
        return result


def process_attributes(attribute_name: str, attribute_type: str, attribute_dimensions: str, ui_attributes):
    result = {}

    if not ui_attributes:
        return {}

    ui_attribute = find_attribute(attribute_name, ui_attributes)

    if not ui_attribute:
        return {}

    if "options" in ui_attribute:
        result["ui:options"] = ui_attribute["options"]

    if attribute_type in PRIMITIVES:
        return get_attribute_config(ui_attribute)
    else:
        blueprint = get_blueprint(attribute_type)
        if attribute_dimensions == "*":
            if "field" in ui_attribute:
                result["ui:field"] = ui_attribute["field"]
                if ui_attribute["field"] == "collapsible":
                    result["collapse"] = {"field": "ArrayField"}
            attribute_ui_recipe = find_attribute(ui_attribute.get("uiRecipe", ""), blueprint.ui_recipes)
            if attribute_ui_recipe:
                result["items"] = process_ui_recipe(attribute_ui_recipe, blueprint.attributes)
    return result


def process_ui_recipe(ui_recipe, attributes):
    setting = {}
    if "plugin" in ui_recipe:
        setting["plugin"] = ui_recipe["plugin"]

    if "field" in ui_recipe:
        return {"ui:field": ui_recipe["field"]}

    for attribute in attributes:
        result = process_attributes(
            attribute["name"], attribute["type"], attribute.get("dimensions", ""), ui_recipe.get("attributes", None)
        )
        setting[attribute["name"]] = result

    return setting


DEFAULT_PREVIEW_UI_RECIPE = {
    "type": "system/SIMOS/UiRecipe",
    "name": "PREVIEW",
    "description": "",
    "plugin": "PREVIEW",
    "attributes": [],
}

DEFAULT_EDIT_UI_RECIPE = {"type": "system/SIMOS/UiRecipe", "name": "EDIT", "description": "", "attributes": []}


def form_to_ui_schema(blueprint, ui_recipe_name=None):
    result = {}

    ui_recipes = blueprint.ui_recipes

    if not find_attribute("PREVIEW", ui_recipes):
        ui_recipes.append(DEFAULT_PREVIEW_UI_RECIPE)

    if not find_attribute("EDIT", ui_recipes):
        # TODO: Set default widget types for attributes
        ui_recipes.append(DEFAULT_EDIT_UI_RECIPE)

    if ui_recipe_name:
        result[ui_recipe_name] = process_ui_recipe(blueprint.get_ui_recipe(ui_recipe_name), blueprint.attributes)
    else:
        for ui_recipe in ui_recipes:
            result[ui_recipe["name"]] = process_ui_recipe(ui_recipe, blueprint.attributes)

    return result

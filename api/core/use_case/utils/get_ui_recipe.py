from core.domain.recipe import Recipe, DefaultRecipe
from core.domain.ui_recipe import UIRecipe, DefaultUIRecipe


def get_ui_recipe(blueprint, ui_recipe_name) -> UIRecipe:
    if blueprint is not None:
        ui_recipe = blueprint.get_ui_recipe(ui_recipe_name)
        if ui_recipe:
            return UIRecipe(name=ui_recipe["name"], attributes=ui_recipe.get("attributes", []))
        else:
            if ui_recipe_name == "DEFAULT_CREATE":
                is_contained = ["name", "description"]
                attributes = []
                for attribute in filter(lambda x: x["name"] not in is_contained, blueprint.attributes):
                    attributes.append({"name": attribute["name"], "contained": False})
                return UIRecipe(name=ui_recipe_name, attributes=attributes)
    return DefaultUIRecipe()

def get_recipe(blueprint, plugin_name) -> Recipe:
    # todo check plugin_name against all plugins and check if type is ui or storage
    if blueprint is not None:
        if plugin_name is not None and blueprint.ui_recipes is not None:
            recipe = next((x for x in blueprint.ui_recipes if "plugin" in x and  x["plugin"] == plugin_name), None)
            if recipe:
                return Recipe(name=recipe["name"], plugin_name=plugin_name, attributes=recipe.get("attributes", []))
    return DefaultRecipe(plugin_name=plugin_name)

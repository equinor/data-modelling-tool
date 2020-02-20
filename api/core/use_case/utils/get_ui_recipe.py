from typing import Optional

from classes.blueprint import Blueprint
from classes.recipe import DefaultRecipe, Recipe, RecipePlugin


def get_recipe(
    blueprint: Optional[Blueprint], ui_recipe_name: Optional[str], plugin_name: RecipePlugin = RecipePlugin.DEFAULT
) -> Recipe:
    if blueprint is not None:
        if ui_recipe_name is not None and blueprint.ui_recipes is not None:
            recipe = next((x for x in blueprint.ui_recipes if x.get("name") == ui_recipe_name), None)
            if recipe:
                return Recipe(name=recipe["name"], plugin_name=recipe["plugin"], attributes=recipe["attributes"])
    return DefaultRecipe(plugin_name=plugin_name)

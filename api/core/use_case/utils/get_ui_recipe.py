from typing import Optional

from core.domain.blueprint import Blueprint

from core.domain.recipe import Recipe, DefaultRecipe
from core.domain.ui_recipe import UIRecipe, DefaultUIRecipe, UiAttribute


def get_ui_recipe(blueprint, ui_recipe_name) -> UIRecipe:
    if blueprint is not None:
        for ui_recipe in blueprint.ui_recipes:
            if ui_recipe.name == ui_recipe_name:
                return UIRecipe(name=ui_recipe.name, attributes=ui_recipe.attributes)
        if ui_recipe_name == "DEFAULT_CREATE":
            is_contained = ["name", "description"]
            attributes = []
            for attribute in filter(lambda x: x.name not in is_contained, blueprint.attributes):
                attributes.append(UiAttribute(name=attribute.name, is_contained=False))
            return UIRecipe(name=ui_recipe_name, attributes=attributes)
    return DefaultUIRecipe()


def get_recipe(blueprint: Optional[Blueprint], plugin_name: Optional[str]) -> Recipe:
    # todo check plugin_name against all plugins and check if type is ui or storage
    if blueprint is not None:
        if plugin_name is not None and blueprint.ui_recipes is not None:
            recipe = next((x for x in blueprint.ui_recipes if x.plugin == plugin_name), None)
            if recipe:
                return Recipe(name=recipe.name, plugin_name=plugin_name, attributes=recipe.attributes)
    return DefaultRecipe(plugin_name=plugin_name)

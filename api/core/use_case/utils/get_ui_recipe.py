from core.domain.ui_recipe import UIRecipe, DefaultUIRecipe


def get_ui_recipe(blueprint, ui_recipe_name) -> UIRecipe:
    if blueprint is not None:
        if ui_recipe := blueprint.get_ui_recipe(ui_recipe_name):
            return UIRecipe(name=ui_recipe["name"], attributes=ui_recipe.get("attributes", []))
    return DefaultUIRecipe()

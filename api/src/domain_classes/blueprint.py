from typing import Dict, List

from domain_classes.blueprint_attribute import BlueprintAttribute
from domain_classes.recipe import Recipe, RecipeAttribute
from domain_classes.storage_recipe import DefaultStorageRecipe, StorageRecipe
from enums import StorageDataTypes


def get_storage_recipes(recipes: List[Dict], attributes: List[BlueprintAttribute]):
    if not recipes:
        return [DefaultStorageRecipe(attributes)]
    else:
        return [
            StorageRecipe(
                name=recipe["name"],
                storageAffinity=recipe.get("storageAffinity", StorageDataTypes.DEFAULT.value),
                attributes=recipe["attributes"],
            )
            for recipe in recipes
        ]


def get_ui_recipe(recipes: List[Dict]):
    # TODO: Add a from_dict() on Recipe class. This should not be duplicated.
    return [
        Recipe(
            name=recipe["name"],
            plugin=recipe.get("plugin", "Default"),
            description=recipe.get("description", ""),
            attributes=[
                RecipeAttribute(
                    name=attr["name"],
                    contained=attr.get("contained", True),
                    ui_recipe=attr.get("uiRecipe", None),
                )
                for attr in recipe.get("attributes", [])
            ],
        )
        for recipe in recipes
    ]


class Blueprint:
    def __init__(self, entity: dict):
        self.name = entity["name"]
        self.entity = entity
        self.extends = entity.get("extends", [])
        self.description = entity.get("description", "")
        self.type = entity["type"]
        self.attributes: List[BlueprintAttribute] = [
            BlueprintAttribute.from_dict(attribute) for attribute in entity.get("attributes", [])
        ]
        self.storage_recipes: List[StorageRecipe] = get_storage_recipes(
            entity.get("storageRecipes", []), self.attributes
        )
        self.ui_recipes: List[Recipe] = get_ui_recipe(entity.get("uiRecipes", []))

    def get_non_primitive_types(self) -> List[BlueprintAttribute]:
        blueprints = [attribute for attribute in self.attributes if not attribute.is_primitive]
        return blueprints

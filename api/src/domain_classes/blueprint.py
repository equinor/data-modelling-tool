from typing import Dict, List

from domain_classes.blueprint_attribute import BlueprintAttribute
from domain_classes.recipe import DefaultRecipe, Recipe, RecipeAttribute
from domain_classes.storage_recipe import DefaultStorageRecipe, StorageRecipe
from enums import PRIMITIVES, StorageDataTypes


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

    def get_none_primitive_types(self) -> List[BlueprintAttribute]:
        blueprints = [attribute for attribute in self.attributes if attribute.attribute_type not in PRIMITIVES]
        return blueprints

    def get_primitive_types(self) -> List[BlueprintAttribute]:
        blueprints = [attribute for attribute in self.attributes if attribute.attribute_type in PRIMITIVES]
        return blueprints

    def get_attribute_names(self):
        return [attribute.name for attribute in self.attributes]

    def get_ui_recipe(self, name=None):
        found = next((x for x in self.ui_recipes if x.name == name), None)
        if found:
            return found
        else:
            return DefaultRecipe(attributes=[attribute for attribute in self.attributes])

    def get_ui_recipe_by_plugin(self, name=None):
        found = next((x for x in self.ui_recipes if x.plugin == name), None)
        if found:
            return found
        else:
            return DefaultRecipe(attributes=[attribute for attribute in self.attributes])

    def get_attribute_type_by_key(self, key):
        return next((attr.attribute_type for attr in self.attributes if attr.name == key), None)

    def get_attribute_by_name(self, key):
        return next((attr for attr in self.attributes if attr.name == key), None)

    def get_model_contained_by_name(self, key):
        return next((attr.contained for attr in self.attributes if attr.name == key), True)

    def is_attr_removable(self, attribute_name):
        for attr in self.attributes:
            if attr.name == attribute_name and not attr.is_primitive:
                if attr.is_array:
                    return False
                elif not attr.is_optional:
                    return False
        return True

from typing import Dict, List

from classes.blueprint_attribute import BlueprintAttribute
from classes.dto import DTO
from classes.recipe import DefaultRecipe, Recipe
from classes.storage_recipe import DefaultStorageRecipe, StorageRecipe
from core.enums import PRIMITIVES


def get_storage_recipes(recipes: List[Dict], attributes: List[BlueprintAttribute]):
    if not recipes:
        return [DefaultStorageRecipe(attributes)]
    else:
        return [StorageRecipe(name=recipe["name"], attributes=recipe["attributes"]) for recipe in recipes]


def get_ui_recipe(recipes: List[Dict]):
    return [Recipe(name=recipe["name"], attributes=recipe["attributes"]) for recipe in recipes]


class Blueprint:
    def __init__(self, dto: DTO):
        self.name = dto.name
        self.description = dto.data.get("description", "")
        self.type = dto.type
        self.attributes: List[BlueprintAttribute] = [
            BlueprintAttribute.from_dict(attribute) for attribute in dto.data.get("attributes", [])
        ]
        self.storage_recipes: List[StorageRecipe] = get_storage_recipes(
            dto.data.get("storageRecipes", []), self.attributes
        )
        self.ui_recipes: List[Recipe] = get_ui_recipe(dto.data.get("uiRecipes", []))

    @classmethod
    def from_dict(cls, adict):
        instance = cls(DTO(adict))
        instance.attributes = [BlueprintAttribute.from_dict(attr) for attr in adict.get("attributes", [])]
        instance.storage_recipes = get_storage_recipes(adict.get("storageRecipes", []), instance.attributes)
        instance.ui_recipes = get_ui_recipe(adict.get("uiRecipes", []))
        return instance

    def to_dict(self):
        return {
            "name": self.name,
            "description": self.description,
            "type": self.type,
            "attributes": [attribute.to_dict() for attribute in self.attributes],
            "storageRecipes": [recipe.to_dict() for recipe in self.storage_recipes],
            "uiRecipes": [recipe.to_dict() for recipe in self.ui_recipes],
        }

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

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
            return DefaultRecipe(attributes=[attribute.to_dict() for attribute in self.attributes])

    def get_attribute_type_by_key(self, key):
        return next((attr.attribute_type for attr in self.attributes if attr.name == key), None)

    def get_attribute_by_name(self, key):
        return next((attr for attr in self.attributes if attr.name == key), None)

    def get_model_contained_by_name(self, key):
        return next((attr.contained for attr in self.attributes if attr.name == key), True)

    def is_attr_removable(self, attribute_name):
        for attr in self.attributes:
            if attr.name == attribute_name and not attr.is_primitive():
                if attr.is_array():
                    return False
                elif not attr.is_optional():
                    return False
        return True

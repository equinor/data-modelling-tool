from typing import Dict, List

from classes.blueprint_attribute import BlueprintAttribute
from classes.dto import DTO
from classes.storage_recipe import DefaultStorageRecipe, StorageRecipe
from core.enums import PRIMITIVES


def get_storage_recipes(storage_recipes_dict: List[Dict], attributes: List[BlueprintAttribute]):
    if not storage_recipes_dict:
        return [DefaultStorageRecipe(attributes)]
    else:
        return [StorageRecipe(recipe["name"], recipe["attributes"]) for recipe in storage_recipes_dict]


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
        # TODO: Use uiRecipe class
        self.ui_recipes = dto.data.get("uiRecipes", [])

    @classmethod
    def from_dict(cls, adict):
        instance = cls(DTO(adict))
        instance.attributes = [BlueprintAttribute.from_dict(attr) for attr in adict.get("attributes", [])]
        instance.storage_recipes = get_storage_recipes(adict.get("storageRecipes", []), instance.attributes)
        instance.ui_recipes = adict.get("uiRecipes", [])
        return instance

    def to_dict(self):
        return {
            "name": self.name,
            "description": self.description,
            "type": self.type,
            "attributes": [attribute.to_dict() for attribute in self.attributes],
            "storageRecipes": [recipe.to_dict() for recipe in self.storage_recipes],
            "uiRecipes": self.ui_recipes,
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

    def get_ui_recipe_from_blueprint(self, name=None):
        if name:
            return next((x for x in self.ui_recipes if x["name"] == name), None)
        else:
            name = self.ui_recipes[0] if len(self.ui_recipes) > 0 else {}
            return name

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

from typing import Dict, List

from classes.blueprint_attribute import BlueprintAttribute
from classes.dto import DTO
from classes.storage_recipe import DefaultStorageRecipe, StorageRecipe


def get_storage_recipes(storage_recipes_dict: List[Dict], attributes: List[Dict]):
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
        instance = cls(DTO(adict, uid=adict["_id"]))
        instance.attributes = adict.get("attributes", [])
        instance.storage_recipes = get_storage_recipes(adict.get("storageRecipes", []), adict.get("attributes", []))
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


def get_none_primitive_types(blueprint: Blueprint) -> List[BlueprintAttribute]:
    primitives = ["string", "number", "integer", "number", "boolean"]
    blueprints = [attribute for attribute in blueprint.attributes if attribute.type not in primitives]
    return blueprints


def get_attribute_names(blueprint: Blueprint):
    return [attribute.name for attribute in blueprint.attributes]


def get_ui_recipe_from_blueprint(blueprint: Blueprint, name=None):
    if name:
        return next((x for x in blueprint.ui_recipes if x["name"] == name), None)
    else:
        name = blueprint.ui_recipes[0] if len(blueprint.ui_recipes) > 0 else {}
        return name

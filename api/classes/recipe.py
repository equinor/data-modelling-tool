from enum import Enum
from typing import List, Dict

from core.enums import PRIMITIVES

from classes.blueprint_attribute import BlueprintAttribute


class RecipePlugin(Enum):
    INDEX = "INDEX"
    DEFAULT = "DEFAULT"


class RecipeAttribute:
    def __init__(self, name: str, is_contained: bool = None):
        self.name = name
        self.is_contained = is_contained

    def to_dict(self) -> Dict:
        return {"name": self.name, "contained": self.is_contained}


class Recipe:
    def __init__(self, name: str, attributes: List[BlueprintAttribute] = None):
        self.name = name
        self.recipe_attributes = {
            attribute["name"]: RecipeAttribute(name=attribute["name"], is_contained=attribute.get("contained", None))
            for attribute in attributes
        }

    def is_contained(self, attribute_name: str, attribute_type: str, is_array: bool,
                     plugin: RecipePlugin = RecipePlugin.DEFAULT):
        if plugin == RecipePlugin.INDEX:
            primitive_contained = False
            array_contained = True
            single_contained = True
        else:
            primitive_contained = True
            array_contained = False
            single_contained = False

        if attribute_name in self.recipe_attributes:
            ui_attribute = self.recipe_attributes[attribute_name]
            if ui_attribute is not None and ui_attribute.is_contained is not None:
                print(ui_attribute.to_dict())
                return ui_attribute.is_contained

        if attribute_type in PRIMITIVES:
            return primitive_contained
        else:
            if attribute_name == "attributes":
                return False
            elif is_array:
                return array_contained
            else:
                return single_contained

    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "attributes": [attribute.to_dict() for attribute in self.recipe_attributes.values()],
        }


class DefaultRecipe(Recipe):
    def __init__(self, attributes: List[BlueprintAttribute]):
        super().__init__("Default", attributes=attributes)

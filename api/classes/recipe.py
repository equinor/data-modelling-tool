from enum import Enum
from typing import List, Dict

from core.enums import PRIMITIVES

from classes.blueprint_attribute import BlueprintAttribute


class RecipePlugin(Enum):
    INDEX = "INDEX"
    DEFAULT = "DEFAULT"


class RecipeAttribute:
    def __init__(self, name: str, is_contained: bool, field: str = None):
        self.name = name
        self.is_contained = is_contained
        self.field = field

    def to_dict(self) -> Dict:
        return {"name": self.name, "contained": self.is_contained, "field": self.field}


class Recipe:
    def __init__(self, name: str, attributes: List[BlueprintAttribute] = None):
        self.name = name
        self.ui_attributes = {
            attribute["name"]: RecipeAttribute(
                name=attribute["name"], is_contained=attribute.get("contained", True), field=attribute.get("field")
            )
            for attribute in attributes
        }

    def is_contained(
        self, attribute_name: str, attribute_type: str, is_array: bool, plugin: RecipePlugin = RecipePlugin.DEFAULT
    ):

        if plugin == RecipePlugin.INDEX:
            primitive_contained = False
            array_contained = True
            single_contained = True
        else:
            primitive_contained = True
            array_contained = False
            single_contained = False

        if attribute_name in self.ui_attributes:
            ui_attribute = self.ui_attributes[attribute_name]
            return ui_attribute.is_contained

        if attribute_type in PRIMITIVES:
            return primitive_contained
        else:
            if is_array:
                return array_contained
            else:
                return single_contained

    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "attributes": [attribute.to_dict() for attribute in self.ui_attributes.values()],
        }


class DefaultRecipe(Recipe):
    def __init__(self, attributes: List[BlueprintAttribute]):
        super().__init__("Default", attributes=attributes)

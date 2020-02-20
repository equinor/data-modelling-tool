from enum import Enum
from typing import List

from utils.data_structure.find import get

from core.enums import PRIMITIVES


class RecipePlugin(Enum):
    INDEX = "INDEX"
    DEFAULT = "DEFAULT"


class RecipeAttribute:
    def __init__(self, name: str, is_contained: bool = None):
        self.name = name
        self.is_contained = is_contained


class Recipe:
    def __init__(self, name: str, plugin_name: str, attributes: List = None):
        self.name = name
        self.plugin = plugin_name
        self.recipe_attributes = {}
        if attributes:
            for attribute in attributes:
                name = get(attribute, "name")
                self.recipe_attributes[name] = RecipeAttribute(
                    name=name, is_contained=attribute.get("contained", True)
                )

        if plugin_name == RecipePlugin.INDEX:
            self.primitive_contained = False
            self.array_contained = True
            self.single_contained = True
        else:
            self.primitive_contained = True
            self.array_contained = False
            self.single_contained = False

    def is_contained(self, attribute_name: str, attribute_type: str, is_array: bool):
        if attribute_name in self.recipe_attributes:
            ui_attribute = self.recipe_attributes[attribute_name]
            if ui_attribute is not None and ui_attribute.is_contained is not None:
                return ui_attribute.is_contained

        if attribute_type in PRIMITIVES:
            return self.primitive_contained
        else:
            if attribute_name == "attributes":
                return False
            elif is_array:
                return self.array_contained
            else:
                return self.single_contained


class DefaultRecipe(Recipe):
    def __init__(self, plugin_name: RecipePlugin):
        super().__init__("Default", plugin_name=plugin_name)

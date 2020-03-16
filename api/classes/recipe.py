from enum import Enum
from typing import List, Dict

from core.enums import PRIMITIVES

from classes.blueprint_attribute import BlueprintAttribute


class RecipePlugin(Enum):
    INDEX = "INDEX"
    DEFAULT = "DEFAULT"


class RecipeAttribute:
    def __init__(
        self,
        name: str,
        is_contained: bool,
        field: str = None,
        collapsible: bool = None,
        ui_recipe: str = None,
        mapping: str = None,
    ):
        self.name = name
        self.is_contained = is_contained
        self.field = field
        self.collapsible = collapsible
        self.ui_recipe = ui_recipe
        self.mapping = mapping

    def to_dict(self) -> Dict:
        result = {"name": self.name, "contained": self.is_contained}
        if self.field:
            result["field"] = (self.field,)
        if self.collapsible:
            result["collapsible"] = self.collapsible
        if self.ui_recipe:
            result["uiRecipe"] = self.ui_recipe
        if self.mapping:
            result["mapping"] = self.mapping

        return result


class Recipe:
    def __init__(
        self,
        name: str,
        attributes: List[RecipeAttribute] = None,
        description: str = "",
        plugin: str = "Default",
        hide_tab: bool = False,
    ):
        self.name = name
        self.ui_attributes = attributes
        self.description = description
        self.plugin = plugin
        self.hide_tab = hide_tab

    def get_attribute_by_name(self, key):
        return next((attr for attr in self.ui_attributes if attr.name == key), None)

    def is_contained(self, attribute: BlueprintAttribute, plugin: RecipePlugin = RecipePlugin.DEFAULT):
        if plugin == RecipePlugin.INDEX:
            primitive_contained = False
            array_contained = True
            single_contained = True
        else:
            primitive_contained = True
            array_contained = False
            single_contained = False

        ui_attribute = self.get_attribute_by_name(attribute.name)
        if ui_attribute:
            return ui_attribute.is_contained

        if attribute.attribute_type in PRIMITIVES:
            return primitive_contained
        else:
            if attribute.is_array():
                return array_contained
            else:
                return single_contained

    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "attributes": [attribute.to_dict() for attribute in self.ui_attributes],
            "hideTab": self.hide_tab,
            "plugin": self.plugin,
            "description": self.description,
        }


class DefaultRecipe(Recipe):
    def __init__(self, attributes: List[BlueprintAttribute]):
        recipe_attributes = [RecipeAttribute(name=attr.name, is_contained=True) for attr in attributes]
        super().__init__("Default", attributes=recipe_attributes)

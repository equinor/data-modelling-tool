from typing import List

from classes.blueprint_attribute import BlueprintAttribute

DEFAULT_PRIMITIVE_CONTAINED = True
DEFAULT_ARRAY_CONTAINED = False
DEFAULT_TYPE_CONTAINED = False
PRIMITIVES = ["string", "number", "integer", "boolean"]


class UiAttribute:
    def __init__(self, name: str, is_contained: bool = None):
        self.name = name
        self.is_contained = is_contained


class UIRecipe:
    def __init__(self, name: str, attributes: List = None):
        self.name = name
        attributes = attributes if attributes else []
        self.ui_attributes = {
            attribute["name"]: UiAttribute(name=attribute["name"], is_contained=attribute.get("contained", True))
            for attribute in attributes
        }

    def is_contained(self, attribute: BlueprintAttribute):
        attribute_name = attribute.name
        attribute_type = attribute.type
        is_array = attribute.dimensions == "*"

        if attribute_name in self.ui_attributes:
            ui_attribute = self.ui_attributes[attribute_name]
            if ui_attribute.is_contained is not None:
                return ui_attribute.is_contained
        # todo contained should be set be defaults or overriden by the INDEX ui recipe.
        if attribute_type in PRIMITIVES:
            return DEFAULT_PRIMITIVE_CONTAINED

        # is_contained is default false all types because entities should behave like that.
        # blueprints must have attributes, and to avoid setting contained true on every blueprint that
        # is made, we set attributes as contained.
        if attribute_name == "attributes":
            return True
        else:
            if is_array:
                return DEFAULT_ARRAY_CONTAINED
            else:
                return DEFAULT_TYPE_CONTAINED


class DefaultUIRecipe(UIRecipe):
    def __init__(self):
        super().__init__("Default")

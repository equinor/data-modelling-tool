from typing import List

DEFAULT_PRIMITIVE_CONTAINED = True
DEFAULT_ARRAY_CONTAINED = True
DEFAULT_TYPE_CONTAINED = True
PRIMITIVES = ["string", "number", "integer", "boolean"]


class UIAttribute:
    def __init__(self, name: str, is_contained: bool = None):
        self.name = name
        self.is_contained = is_contained


class UIRecipe:
    def __init__(self, name: str, attributes: List = None):
        self.name = name
        self.ui_attributes = {}
        if attributes:
            self._convert_attributes(attributes)

    def _convert_attributes(self, attributes):
        for attribute in attributes:
            self.ui_attributes[attribute["name"]] = UIAttribute(
                name=attribute["name"], is_contained=attribute.get("contained")
            )

    def is_contained(self, attribute):
        attribute_name = attribute["name"]
        attribute_type = attribute["type"]
        attribute_contained = attribute.get("contained")
        is_array = attribute.get("dimensions", "") == "*"

        if attribute_name in self.ui_attributes:
            ui_attribute = self.ui_attributes[attribute_name]
            if ui_attribute.is_contained is not None:
                return ui_attribute.is_contained
        if attribute_contained:
            return attribute_contained
        if attribute_type in PRIMITIVES:
            return DEFAULT_PRIMITIVE_CONTAINED
        else:
            if is_array:
                return DEFAULT_ARRAY_CONTAINED
            else:
                return DEFAULT_TYPE_CONTAINED


class DefaultUIRecipe(UIRecipe):
    def __init__(self):
        super().__init__("Default")

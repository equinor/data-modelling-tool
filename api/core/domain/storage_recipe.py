from typing import List

DEFAULT_PRIMITIVE_CONTAINED = True
DEFAULT_COMPLEX_CONTAINED = True
PRIMITIVES = ["string", "number", "integer", "boolean"]


class StorageRecipeAttribute:
    def __init__(self, name: str, is_contained: bool = DEFAULT_PRIMITIVE_CONTAINED):
        self.name = name
        self.is_contained = is_contained


class StorageRecipe:
    def __init__(self, name: str, attributes: List = None):
        self.name = name
        self.storage_recipe_attributes = {}
        if attributes:
            self._convert_attributes(attributes)

    def _convert_attributes(self, attributes):
        for attribute in attributes:
            self.storage_recipe_attributes[attribute.name] = StorageRecipeAttribute(
                name=attribute.name, is_contained=attribute.contained
            )

    def is_contained(self, attribute_name, attribute_type):
        if attribute_name in self.storage_recipe_attributes:
            return self.storage_recipe_attributes[attribute_name].is_contained
        if attribute_type in PRIMITIVES:
            return DEFAULT_PRIMITIVE_CONTAINED
        else:
            return DEFAULT_COMPLEX_CONTAINED


class DefaultStorageRecipe(StorageRecipe):
    def __init__(self):
        super().__init__("Default")

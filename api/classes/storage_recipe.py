from typing import Dict, List

from classes.blueprint_attribute import BlueprintAttribute

DEFAULT_PRIMITIVE_CONTAINED = True
DEFAULT_COMPLEX_CONTAINED = True
PRIMITIVES = ["string", "number", "integer", "boolean"]


class StorageRecipeAttribute:
    def __init__(self, name: str, is_contained: bool = DEFAULT_PRIMITIVE_CONTAINED):
        self.name = name
        self.is_contained = is_contained

    def to_dict(self) -> Dict:
        return {"name": self.name, "contained": self.is_contained}


class StorageRecipe:
    def __init__(self, name: str, attributes=None):
        attributes = attributes if attributes else {}
        self.name = name
        self.storage_recipe_attributes = {
            attribute["name"]: StorageRecipeAttribute(attribute["name"], is_contained=attribute["contained"])
            for attribute in attributes
        }

    def is_contained(self, attribute_name, attribute_type):
        if attribute_name in self.storage_recipe_attributes:
            return self.storage_recipe_attributes[attribute_name].is_contained
        if attribute_type in PRIMITIVES:
            return DEFAULT_PRIMITIVE_CONTAINED
        else:
            return DEFAULT_COMPLEX_CONTAINED

    def to_dict(self) -> Dict:
        return {
            self.name: {attribute.name: attribute.to_dict() for attribute in self.storage_recipe_attributes.values()}
        }


class DefaultStorageRecipe(StorageRecipe):
    def __init__(self, attributes: List[BlueprintAttribute]):
        super().__init__("Default")
        self.storage_recipe_attributes = {
            attribute.name: StorageRecipeAttribute(attribute.name, is_contained=True) for attribute in attributes
        }

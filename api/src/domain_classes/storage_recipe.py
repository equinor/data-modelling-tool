from typing import Dict, List

from domain_classes.blueprint_attribute import BlueprintAttribute
from enums import StorageDataTypes


class StorageAttribute:
    def __init__(
        self,
        name: str,
        contained: bool = True,
        storageTypeAffinity: str = StorageDataTypes.DEFAULT.value,
        label: str = "",
        description: str = "",
        **kwargs,
    ):
        self.name = name
        self.is_contained = contained
        self.type = "system/SIMOS/StorageAttribute"
        self.storage_type_affinity = StorageDataTypes(storageTypeAffinity)
        self.label = label
        self.description = description

    def __repr__(self):
        return f"name: {self.name}, contained: {self.is_contained}, optional: {self.storage_type_affinity}"

    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "contained": self.is_contained,
            "type": self.type,
            "storageTypeAffinity": self.storage_type_affinity.value,
            "label": self.label,
            "description": self.description,
        }


class StorageRecipe:
    def __init__(
        self,
        name: str,
        attributes: List[Dict] = None,
        storageAffinity: str = StorageDataTypes.DEFAULT.value,
        description: str = "",
    ):
        attributes = attributes if attributes else []
        self.name = name
        self.description = description
        self.storage_affinity = StorageDataTypes(storageAffinity)
        self.storage_attributes = {attribute["name"]: StorageAttribute(**attribute) for attribute in attributes}

    def is_contained(self, attribute_name):
        if attribute_name in self.storage_attributes:
            return self.storage_attributes[attribute_name].is_contained

    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "description": self.description,
            "storageAffinity": self.storage_affinity.value,
            "attributes": [attribute.to_dict() for attribute in self.storage_attributes.values()],
        }


class DefaultStorageRecipe(StorageRecipe):
    def __init__(self, attributes: List[BlueprintAttribute]):
        super().__init__("Default")
        self.storage_recipe_attributes = [StorageAttribute(attribute.name, contained=True) for attribute in attributes]

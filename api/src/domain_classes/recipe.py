from typing import Dict, List

from domain_classes.blueprint_attribute import BlueprintAttribute


class RecipeAttribute:
    def __init__(
        self,
        name: str,
        contained: bool,
        ui_recipe: str = None,
    ):
        self.name = name
        self.contained = contained
        self.ui_recipe = ui_recipe

    def to_dict(self) -> Dict:
        result = {"name": self.name, "contained": self.contained}

        if self.ui_recipe:
            result["uiRecipe"] = self.ui_recipe

        return result


class Recipe:
    def __init__(
        self,
        name: str,
        attributes: List[RecipeAttribute] = None,
        description: str = "",
        plugin: str = "Default",
    ):
        self.name = name
        self.ui_attributes = attributes
        self.description = description
        self.plugin = plugin

    def get_attribute_by_name(self, key):
        return next((attr for attr in self.ui_attributes if attr.name == key), None)

    def is_contained(self, attribute: BlueprintAttribute):

        array_contained = False
        single_contained = False

        ui_attribute = self.get_attribute_by_name(attribute.name)
        if ui_attribute:
            return ui_attribute.contained

        if attribute.is_primitive:
            return True
        else:
            if attribute.is_array:
                return array_contained
            else:
                return single_contained

    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "attributes": [attribute.to_dict() for attribute in self.ui_attributes],
            "plugin": self.plugin,
            "description": self.description,
        }


class DefaultRecipe(Recipe):
    def __init__(self, attributes: List[BlueprintAttribute]):
        recipe_attributes = [RecipeAttribute(name=attr.name, contained=True) for attr in attributes]
        super().__init__("Default", attributes=recipe_attributes)

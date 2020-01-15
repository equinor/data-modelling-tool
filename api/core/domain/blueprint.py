def get_attributes_with_reference(blueprint):
    primitives = ["string", "number", "integer", "number", "boolean"]
    blueprints = list(filter(lambda item: hasattr(item, "type") and item.type not in primitives, blueprint.attributes))
    # TODO: Removed enum since not working
    blueprints = list(filter(lambda item: item.name != "enum", blueprints))
    return [blueprint.to_dict() for blueprint in blueprints]


def get_attribute_names(blueprint):
    return list(map(lambda item: item.name, blueprint.attributes))


def get_ui_recipe_from_blueprint(blueprint, name=None):
    if name:
        return next((x for x in blueprint.ui_recipes if x["name"] == name), None)
    else:
        name = blueprint.ui_recipes[0] if len(blueprint.ui_recipes) > 0 else {}
        return name


class Blueprint:
    def __init__(self, name: str, description: str, type: str):
        self.name = name
        self.description = description
        self.type = type
        self.attributes = []
        self.storage_recipes = []
        self.ui_recipes = []

    @classmethod
    def from_dict(cls, adict):
        instance = cls(name=adict["name"], description=adict.get("description", ""), type=adict["type"])
        instance.attributes = adict.get("attributes", [])
        instance.storage_recipes = adict.get("storageRecipes", [])
        instance.ui_recipes = adict.get("uiRecipes", [])
        return instance

    def to_dict(self, *, include_defaults: bool = True):
        return {
            "name": self.name,
            "description": self.description,
            "type": self.type,
            "attributes": self.attributes,
            "storageRecipes": self.storage_recipes,
            "uiRecipes": self.ui_recipes,
        }

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

class Blueprint:
    def __init__(self, uid: str, name: str, description: str, type: str):
        self.uid = uid
        self.name = name
        self.description = description
        self.type = type
        self.attributes = []
        self.storage_recipes = []
        self.ui_recipes = []

    def get_attributes_with_reference(self):
        primitives = ["string", "number", "integer", "number", "boolean"]
        blueprints = list(filter(lambda item: "type" in item and item["type"] not in primitives, self.attributes))
        # TMP: Remove enum since not working
        blueprints = list(filter(lambda item: item["name"] != "enum", blueprints))
        return blueprints

    def get_storage_recipe(self):
        if len(self.storage_recipes) > 0:
            return self.storage_recipes[0]

    def get_attribute_names(self):
        return list(map(lambda item: item["name"], self.attributes))

    def get_ui_schema(self):
        ui_schema = self.ui_recipes[0] if len(self.ui_recipes) > 0 else {}
        view = self.ui_recipes[1] if len(self.ui_recipes) > 1 else {}
        return ui_schema, view

    def get_values(self, attribute_name):
        data = self.to_dict()
        if attribute_name in data:
            return data[attribute_name]
        else:
            return None

    @classmethod
    def from_dict(cls, adict):
        instance = cls(
            name=adict["name"],
            description=adict.get("description", ""),
            type=adict["type"],
            uid=adict.get("_id", adict.get("uid", "")),
        )
        instance.attributes = adict.get("attributes", "")
        instance.storage_recipes = adict.get("storageRecipes", [])
        instance.ui_recipes = adict.get("uiRecipes", [])
        return instance

    def to_dict(self):
        return {
            "name": self.name,
            "_id": self.uid,
            "description": self.description,
            "type": self.type,
            "attributes": self.attributes,
            "storageRecipes": self.storage_recipes,
            "uiRecipes": self.ui_recipes,
        }

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

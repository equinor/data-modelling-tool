class Blueprint:
    def __init__(self, uid: str, name: str, description: str, type: str):
        self.uid = uid
        self.name = name
        self.description = description
        self.type = type
        self.attributes = []
        self.storage_recipes = []

    def get_attributes_with_reference(self):
        primitives = ["string", "number", "integer", "number", "boolean"]
        blueprints = list(filter(lambda item: "type" in item and item["type"] not in primitives, self.attributes))
        return blueprints

    def get_storage_recipe(self):
        if len(self.storage_recipes) > 0:
            return self.storage_recipes[0]["type"]

    def get_attribute_names(self):
        return list(map(lambda item: item["name"], self.attributes))

    @classmethod
    def from_dict(cls, adict):
        instance = cls(
            name=adict["name"],
            description=adict["description"],
            type=adict["type"],
            uid=adict.get("_id", adict.get("uid", "")),
        )
        instance.attributes = adict.get("attributes", "")
        instance.storage_recipes = adict.get("storageRecipes", [])
        return instance

    def to_dict(self):
        return {
            "name": self.name,
            "_id": self.uid,
            "description": self.description,
            "type": self.type,
            "attributes": self.attributes,
        }

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

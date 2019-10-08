class Blueprint:
    def __init__(self, uid: str, name: str, description: str, type: str):
        self.uid = uid
        self.name = name
        self.description = description
        self.type = type
        self.attributes = []

    def get_attributes_with_reference(self):
        primitives = ["string", "number", "integer", "number", "boolean"]
        blueprints = list(filter(lambda item: "type" in item and item["type"] not in primitives, self.attributes))
        return blueprints

    @classmethod
    def from_dict(cls, adict):
        instance = cls(
            name=adict["name"],
            description=adict["description"],
            type=adict["type"],
            uid=adict.get("uid", adict.get("__id")),
        )
        instance.attributes = adict.get("attributes", "")
        return instance

    def to_dict(self):
        return {
            "name": self.name,
            "uid": self.uid,
            "description": self.description,
            "type": self.type,
            "attributes": self.attributes,
        }

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

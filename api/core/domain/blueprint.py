from core.domain.base import Base


class AttributeReference:
    def __init__(self, name: str, type: str, dimensions: str, value: str = None):
        self.name = name
        self.type = type
        self.dimensions = dimensions
        self.value = value

    def to_dict(self):
        result = {"name": self.name, "type": self.type, "dimensions": self.dimensions, "value": self.value}
        return result


class Blueprint(Base):
    def __init__(self, name: str, description: str, type: str):
        super().__init__()
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
        instance = cls(name=adict["name"], description=adict["description"], type=adict["type"])
        instance.attributes = adict.get("attributes", "")
        instance = cls(name=adict["name"], description=adict.get("description", ""), type=adict["type"])
        if "attributes" in adict:
            instance.attributes = adict["attributes"]
        if "uid" in adict:
            instance._uid = adict["uid"]
        return instance

    def to_dict(self):
        return {"name": self.name, "description": self.description, "type": self.type, "attributes": self.attributes}

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

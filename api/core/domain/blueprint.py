from typing import Dict
from uuid import uuid4


class AttributeReference:
    def __init__(self, name: str, type: str, dimensions: str, value: str = None):
        self.name = name
        self.type = type
        self.dimensions = dimensions
        self.value = value

    def to_dict(self):
        result = {"name": self.name, "type": self.type, "dimensions": self.dimensions, "value": self.value}
        return result


class Base:
    def __init__(self):
        self._uid = uuid4()

    @property
    def uid(self):
        return str(self._uid)


class Blueprint(Base):
    def __init__(self, name: str, description: str, type: str):
        super().__init__()
        self.name = name
        self.description = description
        self.type = type
        self.attributes = []

    def get_attributes_with_reference(self):
        print(self.to_dict())
        primitives = ["string", "number", "integer", "number", "boolean"]
        blueprints = list(filter(lambda item: "type" in item and item["type"] not in primitives, self.attributes))
        return blueprints

    @classmethod
    def from_dict(cls, adict):
        instance = cls(name=adict["name"], description=adict["description"], type=adict["type"])
        instance.attributes = adict["attributes"]
        if "uid" in adict:
            instance._uid = adict["uid"]
        return instance

    def to_dict(self):
        return {"name": self.name, "description": self.description, "type": self.type, "attributes": self.attributes}

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()


class Package(Base):
    def __init__(self, name: str, description: str, type: str, is_root: bool):
        super().__init__()
        self.name = name
        self.description = description
        self.type = type
        self.packages = []
        self.blueprints = []
        self.is_root = is_root

    def add_package(self, item):
        self.packages.append(item)

    def add_blueprint(self, item):
        self.blueprints.append(item)

    @classmethod
    def from_dict(cls, adict):
        instance = cls(
            name=adict["name"],
            description=adict["description"],
            type=adict["type"],
            is_root=adict.get("isRoot", False),
        )
        instance.packages = adict["packages"]
        instance.blueprints = adict["blueprints"]
        if "uid" in adict:
            instance._uid = adict["uid"]
        return instance

    def to_dict(self):
        return {
            "name": self.name,
            "description": self.description,
            "type": self.type,
            "packages": self.packages,
            "blueprints": self.blueprints,
            "isRoot": self.is_root,
        }

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

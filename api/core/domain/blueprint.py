from typing import Dict
from uuid import uuid4


from typing import List, Dict


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
        primitives = ["string", "number", "integer", "number", "boolean"]
        blueprints = list(filter(lambda item: "type" in item and item["type"] not in primitives, self.attributes))
        return blueprints

    @classmethod
    def from_dict(cls, adict):
        instance = cls(uid=adict["uid"], name=adict["name"], description=adict["description"], type=adict["type"])
        instance.attributes = adict.get("attributes", "")
        print("FROM DICT", adict)
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


class Package:
    def __init__(
        self,
        name: str,
        description: str,
        blueprints: List[Dict] = None,
        dependencies: List[Dict] = [],
        uid: str = None,
    ):
        self.uid = uid
        self.name = name
        self.description = description
        self.type = "template/package"
        # TODO: Create Dependencies class
        self.dependencies = dependencies
        self.blueprints = blueprints
        self.packages = []

    def addPackage(self, package):
        self.packages.append(package)

    @classmethod
    def from_dict(cls, adict):
        instance = cls(
            uid=adict["uid"],
            name=adict["name"],
            description=adict["description"],
            blueprints=adict["blueprints"],
            dependencies=adict["dependencies"],
        )

        instance.packages = [Package.from_dict(package) for package in adict["packages"]]

        return instance

    def to_dict(self):
        result = {
            "uid": self.uid,
            "name": self.name,
            "description": self.description,
            "type": self.type,
            "blueprints": self.blueprints,
            "dependencies": self.dependencies,
            "packages": [package.to_dict() for package in self.packages],
        }
        return result

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()


class Entity(Base):
    def __init__(self, init=None):
        super().__init__()
        if init is not None:
            self.__dict__.update(init)

    def __getitem__(self, key):
        return self.__dict__[key]

    def __setitem__(self, key, value):
        self.__dict__[key] = value

    def __delitem__(self, key):
        del self.__dict__[key]

    def __contains__(self, key):
        return key in self.__dict__

    def __len__(self):
        return len(self.__dict__)

    def __repr__(self):
        return repr(self.__dict__)

    def to_dict(self):
        return self.__dict__

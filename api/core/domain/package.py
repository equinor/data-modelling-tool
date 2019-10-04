from typing import Dict, List


class Package:
    def __init__(
        self,
        name: str,
        uid: str,
        dependencies: List[Dict] = [],
        description: str = "",
        type: str = "templates/DMT/Package",
        blueprints: List[Dict] = None,
    ):
        self.name = name
        self.uid = uid
        self.description = description
        self.type = type
        # TODO: Create Dependencies class
        self.dependencies = dependencies
        self.blueprints = blueprints
        self.packages = []

    @classmethod
    def from_dict(cls, adict):
        instance = cls(
            name=adict.get("name", ""),
            uid=adict.get("_id", ""),
            description=adict.get("description", ""),
            blueprints=adict.get("blueprints", ""),
            dependencies=adict.get("dependencies", ""),
            type=adict.get("type", ""),
        )

        instance.packages = [Package.from_dict(package) for package in adict.get("packages", "")]

        return instance

    # TODO: Find other way to do this
    @staticmethod
    def contained_package_to_dict(package):
        if isinstance(package, Package):
            return package.to_dict()
        if isinstance(package, Dict):
            return package

    def to_dict(self):
        result = {
            "uid": self.uid,
            "name": self.name,
            "description": self.description,
            "type": self.type,
            "blueprints": self.blueprints,
            "dependencies": self.dependencies,
            "packages": [self.contained_package_to_dict(package) for package in self.packages],
        }
        return result

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

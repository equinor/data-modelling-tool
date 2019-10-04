from typing import Dict, List


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

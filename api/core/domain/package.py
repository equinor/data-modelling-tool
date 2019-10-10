from typing import Dict, List, Optional


class Package:
    def __init__(
        self,
        name: str,
        uid: str,
        dependencies: Optional[List[Dict]] = None,
        description: str = "",
        type: str = "templates/DMT/Package",
        blueprints: List[Dict] = None,
        is_root: bool = False,
    ):
        self.name = name
        self.uid = uid
        self.description = description
        self.type = type
        # TODO: Create Dependencies class
        self.dependencies = [] if not dependencies else dependencies
        self.blueprints = [] if not blueprints else blueprints
        self.packages = []
        self.is_root = is_root
        self.storage_recipes = []

    @classmethod
    def from_dict(cls, adict):
        instance = cls(
            name=adict.get("name", ""),
            uid=adict.get("_id", adict.get("uid")),
            description=adict.get("description", ""),
            blueprints=adict.get("blueprints", ""),
            dependencies=adict.get("dependencies", ""),
            type=adict.get("type", ""),
        )

        instance.packages = [Package.from_dict(package) for package in adict.get("packages", "")]

        return instance

    def get_storage_recipe(self):
        if len(self.storage_recipes) > 0:
            return self.storage_recipes[0]["type"]

    # TODO: Find other way to do this
    @staticmethod
    def contained_package_to_dict(package):
        if isinstance(package, Package):
            return package.to_dict()
        if isinstance(package, Dict):
            return package

    def to_dict(self):
        result = {
            "_id": self.uid,
            "name": self.name,
            "description": self.description,
            "type": self.type,
            "blueprints": self.blueprints,
            "dependencies": self.dependencies,
            "packages": [self.contained_package_to_dict(package) for package in self.packages],
            "isRoot": self.is_root,
        }
        return result

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

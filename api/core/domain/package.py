from typing import Dict, List

from config import Config


class Dependency:
    # TODO: Prod standard data_source as default ie. npm.org
    # TODO: Enforce a semver system on version
    def __init__(self, package: str, version: str = "latest", data_source: str = "templates", alias: str = None):
        self.package = package
        self.version = version
        self.data_source = data_source
        self.alias = alias

    @classmethod
    def from_dict(cls, a_dict):
        return cls(
            package=a_dict["package"],
            version=a_dict["version"],
            data_source=a_dict["data_source"],
            alias=a_dict["alias"],
        )

    def to_dict(self):
        return {"package": self.package, "version": self.version, "data_source": self.data_source, "alias": self.alias}


class Package:
    def __init__(
        self,
        name: str,
        uid: str,
        dependencies: List[Dependency] = None,
        description: str = None,
        type: str = Config.DMT_PACKAGE,
        # TODO: Should handle refs and contained blueprints to be consistent with rest of the system
        blueprints: List[Dict] = None,
        is_root: bool = False,
    ):
        self.name = name
        self.uid = uid
        self.description = description
        self.type = type
        self.dependencies = [] if not dependencies else dependencies
        self.blueprints = [] if not blueprints else blueprints
        self.packages = []
        self.is_root = is_root
        self.storage_recipes = []

    @classmethod
    def from_dict(cls, adict):
        instance = cls(
            name=adict["name"],
            uid=adict["_id"],
            description=adict.get("description"),
            blueprints=adict.get("blueprints"),
            dependencies=[Dependency.from_dict(dependency) for dependency in adict.get("dependencies", [])],
            type=adict.get("type", Config.DMT_PACKAGE),
        )

        instance.packages = [Package.from_dict(package) for package in adict.get("packages", "")]
        instance.storage_recipes = adict.get("storageRecipes", [])
        return instance

    def get_storage_recipe(self):
        if len(self.storage_recipes) > 0:
            return self.storage_recipes[0]

    def get_values(self, attribute_name):
        data = self.to_dict()
        if attribute_name in data:
            return data[attribute_name]
        else:
            return None

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
            "dependencies": [dependency.to_dict() for dependency in self.dependencies],
            "packages": [self.contained_package_to_dict(package) for package in self.packages],
            "isRoot": self.is_root,
            "storageRecipes": self.storage_recipes,
        }
        return result

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

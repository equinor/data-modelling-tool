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

    def to_dict(self, *, include_defaults: bool = True):
        return {"package": self.package, "version": self.version, "data_source": self.data_source, "alias": self.alias}

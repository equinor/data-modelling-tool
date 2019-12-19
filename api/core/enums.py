from enum import Enum, auto


class DataSourceType(Enum):
    MONGO = "mongo-db"
    LOCAL = "localStorage"

    @staticmethod
    def has_value(value):
        values = [item.value for item in DataSourceType]
        return value in values


class DataSourceDocumentType(Enum):
    BLUEPRINT = "blueprints"
    ENTITIES = "entities"
    ALL = "^(blueprints|entities)$"

    @staticmethod
    def has_value(value):
        values = [item.value for item in DataSourceDocumentType]
        return value in values


class RepositoryType(Enum):
    DocumentRepository = auto()
    PackageRepository = auto()
    BlueprintRepository = auto()


class SIMOS(Enum):
    BLUEPRINT = "system/SIMOS/Blueprint"
    BLUEPRINT_ATTRIBUTE = "system/SIMOS/BlueprintAttribute"
    APPLICATION = "system/SIMOS/Application"


class DMT(Enum):
    PACKAGE = "system/DMT/Package"
    ENTITY = "system/DMT/Entity"

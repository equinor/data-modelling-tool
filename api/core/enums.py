from enum import auto, Enum

from core.shared import response_object

PRIMITIVES = {"string", "number", "integer", "boolean"}

STATUS_CODES = {
    response_object.ResponseSuccess.SUCCESS: 200,
    response_object.ResponseFailure.RESOURCE_ERROR: 404,
    response_object.ResponseFailure.PARAMETERS_ERROR: 400,
    response_object.ResponseFailure.SYSTEM_ERROR: 500,
}


class PrimitiveDataTypes(Enum):
    STR = "string"
    NUM = "number"
    INT = "integer"
    BOOL = "boolean"

    def to_py_type(self):
        if self is PrimitiveDataTypes.BOOL:
            return bool
        elif self is PrimitiveDataTypes.INT:
            return int
        elif self is PrimitiveDataTypes.NUM:
            return float
        elif self is PrimitiveDataTypes.STR:
            return str


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
    ATTRIBUTE_TYPES = "system/SIMOS/AttributeTypes"


class DMT(Enum):
    PACKAGE = "system/DMT/Package"
    ENTITY = "system/DMT/Entity"

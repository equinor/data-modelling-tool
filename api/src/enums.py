from enum import Enum

from restful import response_object

PRIMITIVES = {"string", "number", "integer", "boolean"}

STATUS_CODES = {
    response_object.ResponseSuccess.SUCCESS: 200,
    response_object.ResponseFailure.RESOURCE_ERROR: 404,
    response_object.ResponseFailure.PARAMETERS_ERROR: 400,
    response_object.ResponseFailure.SYSTEM_ERROR: 500,
}


class StorageDataTypes(Enum):
    DEFAULT = "default"
    LARGE = "large"
    VERY_LARGE = "veryLarge"
    VIDEO = "video"
    BLOB = "blob"


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


class SIMOS(Enum):
    BLUEPRINT = "system/SIMOS/Blueprint"
    BLUEPRINT_ATTRIBUTE = "system/SIMOS/BlueprintAttribute"
    APPLICATION = "system/SIMOS/Application"
    ATTRIBUTE_TYPES = "system/SIMOS/AttributeTypes"


class DMT(Enum):
    PACKAGE = "system/SIMOS/Package"
    ENTITY = "system/SIMOS/Entity"
    DATASOURCE = "datasource"


class APPLICATION(Enum):
    DEFAULT = "default"
    DMT_ENTITIES = "DMT-Entities"

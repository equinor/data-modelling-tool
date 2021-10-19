from enum import Enum

from restful import response_object

PRIMITIVES = {"string", "number", "integer", "boolean"}

STATUS_CODES = {
    response_object.ResponseSuccess.SUCCESS: 200,
    response_object.ResponseFailure.RESOURCE_ERROR: 404,
    response_object.ResponseFailure.FORBIDDEN: 403,
    response_object.ResponseFailure.PARAMETERS_ERROR: 400,
    response_object.ResponseFailure.SYSTEM_ERROR: 500,
}


BLOB_TYPES = "system/SIMOS/blob_types/PDF"


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
    BLOB = "system/SIMOS/Blob"
    BLUEPRINT_ATTRIBUTE = "system/SIMOS/BlueprintAttribute"
    APPLICATION = "system/SIMOS/Application"
    ATTRIBUTE_TYPES = "system/SIMOS/AttributeTypes"
    UI_RECIPE = "system/SIMOS/UiRecipe"
    STORAGE_RECIPE = "system/SIMOS/StorageRecipe"


class BLUEPRINTS(Enum):
    PACKAGE = "system/SIMOS/Package"
    ENTITY = "system/SIMOS/Entity"
    DATASOURCE = "datasource"

from enum import Enum


PRIMITIVES = {"string", "number", "integer", "boolean"}

STATUS_CODES = {
    "SUCCESS": 200,
    "RESOURCE_ERROR": 404,
    "FORBIDDEN": 403,
    "PARAMETERS_ERROR": 400,
    "SYSTEM_ERROR": 500,
}


BLOB_TYPES = "system/SIMOS/blob_types/PDF"


class StorageDataTypes(Enum):
    DEFAULT = "default"
    LARGE = "large"
    VERY_LARGE = "veryLarge"
    VIDEO = "video"
    BLOB = "blob"


class BuiltinDataTypes(Enum):
    STR = "string"
    NUM = "number"
    INT = "integer"
    BOOL = "boolean"
    OBJECT = "object"  # Any complex type (i.e. any blueprint type)

    def to_py_type(self):
        if self is BuiltinDataTypes.BOOL:
            return bool
        elif self is BuiltinDataTypes.INT:
            return int
        elif self is BuiltinDataTypes.NUM:
            return float
        elif self is BuiltinDataTypes.STR:
            return str
        elif self is BuiltinDataTypes.OBJECT:
            return dict


class SIMOS(Enum):
    BLUEPRINT = "system/SIMOS/Blueprint"
    BLOB = "system/SIMOS/Blob"
    BLUEPRINT_ATTRIBUTE = "system/SIMOS/BlueprintAttribute"
    APPLICATION = "system/SIMOS/Application"
    ATTRIBUTE_TYPES = "system/SIMOS/AttributeTypes"
    UI_RECIPE = "system/SIMOS/UiRecipe"
    STORAGE_RECIPE = "system/SIMOS/StorageRecipe"
    PACKAGE = "system/SIMOS/Package"
    ENTITY = "system/SIMOS/Entity"
    DATASOURCE = "datasource"

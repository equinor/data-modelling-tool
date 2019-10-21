from enum import Enum


class SIMOS(Enum):
    BLUEPRINT = "system/SIMOS/Blueprint"
    BLUEPRINT_ATTRIBUTE = "system/SIMOS/BlueprintAttribute"
    APPLICATION = "system/SIMOS/Application"


class DMT(Enum):
    PACKAGE = "system/DMT/Package"
    ENTITY_PACKAGE = "system/DMT/EntityPackage"

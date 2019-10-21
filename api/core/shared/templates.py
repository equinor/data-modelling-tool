from enum import Enum


class SIMOS(Enum):
    BLUEPRINT = "templates/SIMOS/Blueprint"
    BLUEPRINT_ATTRIBUTE = "templates/SIMOS/BlueprintAttribute"
    APPLICATION = "templates/SIMOS/Application"


class DMT(Enum):
    PACKAGE = "templates/DMT/Package"
    ENTITY_PACKAGE = "templates/DMT/EntityPackage"

from enum import Enum


class DataSourceType(Enum):
    MONGO = "mongo-db"

    @staticmethod
    def has_value(value):
        values = [item.value for item in DataSourceType]
        return value in values


class DataSourceDocumentType(Enum):
    BLUEPRINT = "blueprints"
    ENTITIES = "entities"

    @staticmethod
    def has_value(value):
        values = [item.value for item in DataSourceDocumentType]
        return value in values


class DocumentType(Enum):
    ROOT_PACKAGE = "root-package"
    VERSION = "version"
    SUB_PACKAGE = "subpackage"
    FILE = "file"

    @staticmethod
    def has_value(value):
        values = [item.value for item in DocumentType]
        return value in values

    def has_parent(self):
        return self in (DocumentType.FILE, DocumentType.SUB_PACKAGE, DocumentType.VERSION)

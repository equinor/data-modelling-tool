from enum import Enum
from os.path import dirname

from rest.validators.package_request import validate_package_request


class DocumentType(Enum):
    ROOT_PACKAGE = "root-package"
    VERSION = "version"
    SUB_PACKAGE = "subpackage"
    FILE = "file"


document_type_tuple = (DocumentType.ROOT_PACKAGE, DocumentType.VERSION, DocumentType.SUB_PACKAGE, DocumentType.FILE)


def create_id(node_type: str, title: str, parent_package: str):
    if node_type == DocumentType.ROOT_PACKAGE:
        return f"{title}/package"
    elif node_type == DocumentType.FILE:
        return f"{parent_package}/{title}"
    elif node_type == DocumentType.SUB_PACKAGE:
        return f"{parent_package}/{title}/package"


# TODO: REMOVE
def get_node_type(node_type: str, meta: dict):
    if node_type == DocumentType.FILE:
        return DocumentType.FILE
    elif DocumentType(meta["documentType"]) in document_type_tuple:
        return meta["documentType"]


class PackageRequest:
    def __init__(self, package_request: dict):
        validate_package_request(package_request)
        self.meta = package_request["meta"]
        self.formData = package_request["formData"]
        self.parent_id = package_request["parentId"]
        self.node_type = package_request["nodeType"]
        self.id = create_id(self.node_type, title=self.meta["name"], parent_package=dirname(self.parent_id))

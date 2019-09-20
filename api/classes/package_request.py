from os.path import dirname

from rest.validators.package_request import validate_package_request
from utils.enums import DocumentType
from utils.help_functions import get_parent_id_strip_data_source



def create_id(node_type: DocumentType, name: str, parent_id: str):
    parent_package = dirname(parent_id)
    if node_type == DocumentType.ROOT_PACKAGE:
        return f"{name}/package"
    elif node_type == DocumentType.SUB_PACKAGE:
        return f"{parent_package}/{name}/package"
    elif node_type == DocumentType.FILE:
        return f"{parent_package}/{name}"


class PackageRequest:
    def __init__(self, package_request: dict):
        validate_package_request(package_request)
        self.meta = package_request["meta"]
        self.formData = package_request["formData"]
        self.parent_id = get_parent_id_strip_data_source(package_request["parentId"])
        self.node_type = DocumentType(package_request["nodeType"])
        self.meta["documentType"] = self.node_type.value
        self.id = create_id(self.node_type, name=self.meta["name"], parent_id=self.parent_id)

from os.path import dirname

from rest.validators.package_request import validate_package_request


def create_id(node_type: str, is_root: bool, title: str, parent_package: str):
    if is_root:
        return f"{title}/package.json"
    if node_type == "file":
        return f"{parent_package}/{title}.json"
    if node_type == "folder":
        return f"{parent_package}/{title}/package.json"


def get_node_type(is_root: bool, node_type: str):
    if is_root:
        return "folder"
    else:
        return node_type


class PackageRequest:
    def __init__(self, package_request: dict):
        validate_package_request(package_request)
        self.form_data = package_request["formData"]
        self.parent_id = package_request["parentId"]
        self.is_root = package_request["isRoot"]
        self.node_type = get_node_type(is_root=self.is_root, node_type=package_request["nodeType"])
        self.id = create_id(
            self.node_type, is_root=self.is_root, title=self.form_data["title"], parent_package=dirname(self.parent_id)
        )

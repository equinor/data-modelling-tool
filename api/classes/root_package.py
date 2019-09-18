from classes.data_source import DataSource
from classes.package_request import DocumentType
from utils.help_functions import get_absolute_path


class RootPackage:
    def __init__(self, document: dict, data_source: DataSource):
        self.files = document["formData"].get("files", [])
        self.absolute_files = get_absolute_path(self.files, data_source)
        self.subpackages = document["formData"].get("subpackages", [])
        self.absolute_subpackages = get_absolute_path(self.subpackages, data_source)
        self.children = self.absolute_subpackages + self.absolute_files
        self.latest_version = data_source.client.read_form(document["formData"]["latestVersion"])
        self.latest_version_id = self.latest_version["_id"]
        self.node_type = DocumentType.ROOT_PACKAGE.value
        self.id = f"{data_source.id}/{document['_id']}"
        self.title = document["formData"]["title"]

    def as_dict(self):
        return {"children": self.children, "nodeType": self.node_type, "id": self.id, "title": self.title}

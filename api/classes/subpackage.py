from classes.data_source import DataSource
from utils.help_functions import get_absolute_path


class Package:
    def __init__(self, document: dict, data_source: DataSource):
        self.files = document["formData"].get("files", [])
        self.absolute_files = get_absolute_path(self.files, data_source)
        self.subpackages = document["formData"].get("subpackages", [])
        self.absolute_subpackages = get_absolute_path(self.subpackages, data_source)
        self.children = self.absolute_files + self.absolute_subpackages
        self.title = document["formData"].get("title", "")
        self.node_type = "folder"
        self.is_root = False
        self.id = f"{data_source.id}/{document['_id']}"
        self.document_type = document["meta"].get("documentType")

    def as_dict(self):
        return {
            "children": self.children,
            "nodeType": self.node_type,
            "isRoot": self.is_root,
            "id": self.id,
            "title": self.title,
        }

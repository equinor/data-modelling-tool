from classes.data_source import DataSource
from utils.enums import DocumentType
from utils.help_functions import get_absolute_path


class Package:
    def __init__(self, document: dict, data_source: DataSource):
        self.files = document["formData"].get("files", [])
        self.absolute_files = get_absolute_path(self.files, data_source.id)
        self.subpackages = document["formData"].get("subpackages", [])
        self.absolute_subpackages = get_absolute_path(self.subpackages, data_source.id)
        self.children = self.absolute_files + self.absolute_subpackages
        self.title = document["formData"].get("title", "")
        self.node_type = DocumentType.SUB_PACKAGE
        self.id = f"{data_source.id}/{document['_id']}"
        # TODO: Version documents is now the only document with meta: documentType...
        self.document_type = DocumentType(document["meta"].get("documentType", ""))

    def as_dict(self):
        return {"children": self.children, "nodeType": self.node_type.value, "id": self.id, "title": self.title}

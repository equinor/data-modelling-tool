from classes.data_source import DataSource
from utils.enums import DocumentType


class File:
    def __init__(self, document: dict, data_source: DataSource):
        self.node_type = DocumentType.FILE
        self.id = f"{data_source.id}/{document['_id']}"
        self.title = document["formData"].get("title", "")

    def as_dict(self):
        return {"nodeType": self.node_type.value, "id": self.id, "title": self.title}

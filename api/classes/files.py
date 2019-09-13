from classes.data_source import DataSource


class File:
    def __init__(self, document: dict, data_source: DataSource):
        self.node_type = "file"
        self.is_root = False
        self.id = f"{data_source.id}/{document['_id']}"
        self.title = document["formData"].get("title", "")

    def as_dict(self):
        return {"nodeType": self.node_type, "isRoot": self.is_root, "id": self.id, "title": self.title}

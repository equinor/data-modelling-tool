from core.domain.document import Document
from core.repository.interface.document_repository import DocumentRepository
from typing import List


class Index:
    def __init__(self, data_source_id: str):
        self.data_source_id = data_source_id
        self.index = {}

    def add(self, adict):
        self.index[adict["id"]] = adict

    def to_dict(self):
        return self.index

        # TODO: Replace with data source entity

    def add_data_source(self, data_source_id: str, data_source_name: str, children: List[str]):
        data_source = {"id": data_source_id, "title": data_source_name, "nodeType": "datasource", "children": children}
        self.index[data_source["id"]] = data_source


def get_node_type(path: str) -> str:
    if path == "/":
        return "root-package"
    else:
        return "subpackage"


class GenerateIndexUseCase:
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def execute(self, data_source_id: str, data_source_name: str) -> Index:
        index = Index(data_source_id=data_source_id)

        for node in self.document_repository.list():
            document: Document = node

            start = "" if node.path == "/" else node.path

            children = (
                self.document_repository.get_nodes(f"{start}/{node.filename}") if document.type == "folder" else []
            )

            index.add(
                {
                    "id": f"{data_source_id}/{document.uid}",
                    "title": document.filename,
                    "nodeType": get_node_type(document.type) if document.type == "folder" else document.type,
                    "children": [f"{data_source_id}/{child.uid}" for child in children],
                }
            )

        root_packages = [f"{data_source_id}/{child.uid}" for child in self.document_repository.get_nodes(f"/")]
        index.add_data_source(data_source_id, data_source_name, root_packages)

        return index

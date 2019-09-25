from typing import List

from core.domain.document import Document
from core.repository.mongo.mongo_repository_base import MongoRepositoryBase
from core.repository.interface.document_repository import DocumentRepository


class MongoDocumentRepository(MongoRepositoryBase, DocumentRepository):
    class Meta:
        model = Document

    def __init__(self, db):
        super().__init__(db)

    def get(self, uid: str) -> Document:
        result = self.c().get(uid)
        if result:
            return self.convert_to_model(result)

    def update(self, document: Document) -> None:
        self.c().update(document.uid, document.to_dict())

    def add(self, document: Document) -> None:
        self.c().add(document.to_dict())

    def delete(self, document: Document) -> None:
        self.c().delete(document.uid)

    def list(self):
        return [Document.from_dict(document) for document in self.c().find(filters={})]

    def get_by_path_and_filename(self, path: str, filename: str) -> Document:
        filters = {"path": path, "filename": filename}
        adict = self.c().find_one(filters=filters)
        if adict:
            return Document.from_dict(adict)

    def get_nodes(self, path: str, direct_descendants_only: bool = True) -> List[Document]:
        direct_descendants = "$" if direct_descendants_only else ""
        match_criteria = f"^{path}{direct_descendants}"
        filters = {"path": {"$regex": match_criteria}}
        result = []
        for item in self.c().find(filters=filters):
            result.append(Document.from_dict(item))
        return result

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
        self.c().update(document.id, document.to_dict())

    def add(self, document: Document) -> None:
        self.c().add(document.to_dict())

    def delete(self, document: Document) -> None:
        pass

from core.domain.document import Document
from core.repository.mongo.mongo_repository_base import MongoRepositoryBase


class DocumentRepository(MongoRepositoryBase):
    class Meta:
        model = Document

    def __init__(self, db):
        super().__init__(db)

    def get_by_id(self, document_id: str) -> Document:
        result = self.c().read_form(document_id)
        return self.convert_to_model(result)

    def update(self, document_id: str, document: Document) -> Document:
        adict = document.to_dict()
        return self.c().update(adict, document_id)

    def save(self, document: Document, document_id: str) -> Document:
        document.id = self.c().create_form(document.to_dict(), _id=document_id)
        return document

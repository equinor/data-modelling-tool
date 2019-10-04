from core.domain.document import Document
from core.repository.mongo.document_repository import DocumentRepository


class UpdateDocumentUseCase:
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def execute(self, document_id: str, form_data: dict) -> Document:
        self.document_repository.update(document_id, form_data)
        return form_data

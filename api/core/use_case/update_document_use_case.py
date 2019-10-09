from core.domain.document import Document
from core.domain.dto import DTO
from core.repository.mongo.document_repository import DocumentRepository
from dotted.collection import DottedDict


class UpdateDocumentUseCase:
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def execute(self, document_id: str, form_data: dict, attribute: str) -> Document:
        document: DTO = self.document_repository.get(document_id)
        data = document.data
        if attribute:
            obj = DottedDict(data)
            obj[attribute] = form_data
            data = obj.to_python()
        else:
            data = form_data
        self.document_repository.update(document_id, data)
        return form_data

from core.domain.document import Document


class UpdateDocumentUseCase:
    def __init__(self, document_repo):
        self.document_repo = document_repo

    def execute(self, document_id: str, form_data: dict) -> Document:
        document = self.document_repo.get_by_id(document_id)
        document.formData = form_data
        return self.document_repo.update(document_id, document)

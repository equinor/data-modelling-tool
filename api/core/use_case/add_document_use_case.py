from core.domain.document import Document
from core.repository.template_repository import get_template_by_document_type
from jsonschema import validate, ValidationError


class AddDocumentUseCase:
    def __init__(self, document_repo):
        self.document_repo = document_repo

    def execute(self, document: Document) -> Document:
        if not document.type:
            raise Exception("The requested document does not contain a template reference")

        template = get_template_by_document_type(document.type)

        try:
            validate(instance=document.form_data, schema=template)
        except ValidationError as error:
            raise error

        self.document_repo.add(document)
        return document

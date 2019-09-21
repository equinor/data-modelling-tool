from core.domain.document import Document
from utils.schema_tools.form_to_schema import form_to_schema
from core.repository.template_repository import get_template_by_id
from jsonschema import validate, ValidationError


class AddDocumentUseCase:
    def __init__(self, document_repo):
        self.document_repo = document_repo

    def execute(self, document_id: str, document: Document) -> Document:
        template_id = document.meta.template_ref

        if not template_id:
            raise Exception("The requested document does not contain a template reference")

        if document.meta.get_template_data_source_id() == "templates":
            template = get_template_by_id(document.meta.get_template_name())
        else:
            template = form_to_schema(self.document_repo.get(document.meta.template_ref))

        try:
            validate(instance=document.form_data, schema=template.schema)
        except ValidationError as error:
            raise error

        self.document_repo.add(document)
        return document

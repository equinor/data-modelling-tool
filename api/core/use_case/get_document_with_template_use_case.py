from core.domain.document import Document
from core.domain.template import Template
from typing import NamedTuple
from utils.schema_tools.form_to_schema import form_to_schema
from core.repository.template_repository import get_template_by_id


class DocumentWithTemplateData(NamedTuple):
    template: Template
    document: Document


class GetDocumentWithTemplateUseCase:
    def __init__(self, document_repo):
        self.document_repo = document_repo

    def execute(self, document_id: str) -> DocumentWithTemplateData:
        document: Document = self.document_repo.get_by_id(document_id)

        template_id = document.meta.template_ref
        if not template_id:
            raise Exception("The requested document does not contain a template reference")

        if document.meta.get_template_data_source_id() == "templates":
            template = get_template_by_id(document.meta.get_template_name())
        else:
            template = form_to_schema(self.document_repo.get_by_id(document.meta.template_ref))
        return DocumentWithTemplateData(document=document, template=template)

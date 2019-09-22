from classes.data_source import DataSource
from core.domain.document import Document
from core.domain.template import Template
from typing import NamedTuple

from core.repository.repository_factory import RepositoryType
from utils.schema_tools.form_to_schema import form_to_schema
from core.repository.template_repository import get_template_by_id
from core.repository.interface.document_repository import DocumentRepository


class DocumentWithTemplateData(NamedTuple):
    template: Template
    document: Document


class GetDocumentWithTemplateUseCase:
    def __init__(self, document_repository: DocumentRepository, get_repository):
        self.document_repository = document_repository
        self.get_repository = get_repository

    def execute(self, document_id: str) -> DocumentWithTemplateData:
        document: Document = self.document_repository.get(document_id)

        # TODO: Cleanup template logic and find out where to do remote call
        template_ref = document.meta.template_ref
        if not template_ref:
            raise Exception("The requested document does not contain a template reference")

        if document.meta.get_template_data_source_id() == "templates":
            template = get_template_by_id(document.meta.get_template_name())
        else:
            data_source = DataSource(id=document.meta.get_template_data_source_id())
            remote_document_repository = self.get_repository(RepositoryType.DocumentRepository, data_source)
            blueprint: Document = remote_document_repository.get(document.meta.get_template_id())
            template = Template(
                schema=form_to_schema(blueprint.form_data), uiSchema=None, view=None, meta=blueprint.meta.to_dict()
            )
        return DocumentWithTemplateData(document=document, template=template)

from classes.data_source import DataSource
from core.domain.document import Document
from core.domain.template import Template
from core.repository.repository_exceptions import EntityNotFoundException
from core.repository.repository_factory import RepositoryType
from utils.schema_tools.form_to_schema import form_to_schema
from core.repository.template_repository import get_template_by_id
from core.repository.interface.document_repository import DocumentRepository
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req


class GetDocumentWithTemplateRequestObject(req.ValidRequestObject):
    def __init__(self, document_id):
        self.document_id = document_id

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "document_id" not in adict:
            invalid_req.add_error("document_id", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(document_id=adict.get("document_id"))


class GetDocumentWithTemplateUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository, get_repository):
        self.document_repository = document_repository
        self.get_repository = get_repository

    def process_request(self, request_object: GetDocumentWithTemplateRequestObject):
        document_id = request_object.document_id
        document: Document = self.document_repository.get(document_id)
        if not document:
            raise EntityNotFoundException(uid=document_id)

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

        data = {"template": template.to_dict(), "document": document.to_dict()}

        return res.ResponseSuccess(data)

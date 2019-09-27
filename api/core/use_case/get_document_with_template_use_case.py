from classes.data_source import DataSource
from core.domain.blueprint import Blueprint
from core.domain.template import Template
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.repository.repository_factory import RepositoryType
from utils.schema_tools.form_to_schema import form_to_schema
from core.repository.template_repository import get_template_by_name
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
    def __init__(self, document_repository: MongoBlueprintRepository, get_repository):
        self.document_repository = document_repository
        self.get_repository = get_repository

    def _get_template(self, blueprint: Blueprint) -> Blueprint:
        if blueprint.get_template_data_source_id() == "templates":
            return Blueprint.from_dict(get_template_by_name(blueprint.get_template_name()))
        else:
            data_source = DataSource(id=blueprint.get_template_data_source_id())
            remote_document_repository: MongoBlueprintRepository = self.get_repository(
                RepositoryType.BlueprintRepository, data_source
            )
            return remote_document_repository.find_one(blueprint.get_template_name())

    def process_request(self, request_object: GetDocumentWithTemplateRequestObject):
        document_id = request_object.document_id
        blueprint: Blueprint = self.document_repository.get(document_id)
        if not blueprint:
            raise EntityNotFoundException(uid=document_id)

        template_ref = blueprint.template_ref
        if not template_ref:
            raise Exception("The requested document does not contain a template reference")

        document = self._get_template(blueprint)

        template = Template(schema=form_to_schema(document.form_data), uiSchema=document.ui_recipe, view=None)

        data = {"template": template.to_dict(), "document": blueprint.to_dict()}

        return res.ResponseSuccess(data)

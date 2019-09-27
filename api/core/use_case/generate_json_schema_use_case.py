from classes.data_source import DataSource
from core.domain.blueprint import Blueprint
from core.domain.template import Template
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository
from core.repository.repository_factory import RepositoryType
from core.repository.template_repository import get_template_by_name
from utils.schema_tools.form_to_schema import form_to_schema
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req


class GenerateJsonSchemaRequestObject(req.ValidRequestObject):
    def __init__(self, template_ref):
        self.template_ref = template_ref

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "templateRef" not in adict:
            invalid_req.add_error("templateRef", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(template_ref=adict.get("templateRef"))


def get_template_data_source_id(template_ref) -> str:
    return template_ref.split("/", 1)[0]


def get_template_id(template_ref) -> str:
    return template_ref.split("/", 1)[1]


def get_template_name(template_ref) -> str:
    return template_ref.split("/")[-1]


def get_template_filename(template_ref) -> str:
    return template_ref.split("/")[-1]


class GenerateJsonSchemaUseCase(uc.UseCase):
    def __init__(self, get_repository):
        self.get_repository = get_repository

    def _get_template(self, template_ref: str) -> Blueprint:
        name = get_template_filename(template_ref)

        if get_template_data_source_id(template_ref) == "templates":
            return Blueprint.from_dict(get_template_by_name(name))
        else:
            data_source = DataSource(id=get_template_data_source_id(template_ref))
            remote_document_repository: MongoBlueprintRepository = self.get_repository(
                RepositoryType.BlueprintRepository, data_source
            )

            return remote_document_repository.find_one(name=get_template_name(name))

    def process_request(self, request_object: GenerateJsonSchemaRequestObject):
        template_ref = request_object.template_ref
        if not template_ref:
            raise Exception("The requested document does not contain a template reference")

        blueprint = self._get_template(template_ref)
        template = Template(schema=form_to_schema(blueprint.form_data), uiSchema=blueprint.ui_recipe, view=None)

        return res.ResponseSuccess(template.to_dict())

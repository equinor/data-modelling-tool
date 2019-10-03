from core.domain.template import Template
from core.repository.repository_exceptions import EntityNotFoundException
from core.use_case.utils.get_template import get_template
from utils.schema_tools.form_to_schema import form_to_schema
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req


class GenerateJsonSchemaRequestObject(req.ValidRequestObject):
    def __init__(self, type):
        self.type = type

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "type" not in adict:
            invalid_req.add_error("type", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(type=adict.get("type"))


class GenerateJsonSchemaUseCase(uc.UseCase):
    def __init__(self, get_repository):
        self.get_repository = get_repository

    def process_request(self, request_object: GenerateJsonSchemaRequestObject):
        type = request_object.type

        if not type:
            raise Exception("Missing type")

        blueprint = get_template(self.get_repository, type)

        if not blueprint:
            raise EntityNotFoundException(uid=type)

        data = blueprint.to_dict()
        del data["type"]

        # TODO: Can we use blueprint directly?
        template = Template(schema=form_to_schema(data), uiSchema={}, view=None)

        return res.ResponseSuccess(template.to_dict())

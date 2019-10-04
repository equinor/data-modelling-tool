from core.domain import DocumentDto
from core.domain.blueprint import Blueprint
from core.domain.template import Template
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository
from core.repository.mongo.dto_repository import DocumentDtoRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.use_case.utils.get_template import get_template
from utils.schema_tools.form_to_schema import form_to_schema
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
    def __init__(self, dto_repository: DocumentDtoRepository, get_repository):
        self.dto_repository = dto_repository
        self.get_repository = get_repository

    def process_request(self, request_object: GetDocumentWithTemplateRequestObject):
        document_id = request_object.document_id
        document: DocumentDto = self.dto_repository.get(document_id)
        if not document:
            raise EntityNotFoundException(uid=document_id)

        blueprint_type: str = document["data"]["type"]
        blueprint = get_template(self.get_repository, blueprint_type)

        data = blueprint.to_dict()
        del data["type"]

        template = Template(schema=form_to_schema(data), uiSchema={}, view=None)

        data = {"template": template.to_dict(), "document": document}

        return res.ResponseSuccess(data)

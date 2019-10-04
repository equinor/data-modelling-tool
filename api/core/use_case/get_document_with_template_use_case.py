from core.domain.dto import DTO
from core.domain.template import Template
from core.repository.mongo.document_repository import DocumentRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.use_case.utils.get_template import get_blueprint
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
    def __init__(self, document_repository: DocumentRepository, get_repository):
        self.document_repository = document_repository
        self.get_repository = get_repository

    def process_request(self, request_object: GetDocumentWithTemplateRequestObject):
        document_id = request_object.document_id
        dto: DTO = self.document_repository.get(document_id)
        if not dto:
            raise EntityNotFoundException(uid=document_id)

        blueprint = get_blueprint(self.get_repository, document.type)

        #todo use dto_repository
        blueprint = get_template(self.get_repository, dto.type)
        data = blueprint.to_dict()

        #@todo move to template class, should have a custom template ReactJsonFormTemplate which translate our template to something react json schema understands.
        del data["type"]
        template = Template(schema=form_to_schema(data), uiSchema={}, view=None)

        data = {"template": template.to_dict(), "document": dto.to_dict()}

        return res.ResponseSuccess(data)

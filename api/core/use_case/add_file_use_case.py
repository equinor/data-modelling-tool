from core.repository import Repository
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.utility import get_blueprint
from core.service.document_service import DocumentService


class AddFileRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, name=None, description=None, type=None, attribute=None, path=None, data=None):
        self.parent_id = parent_id
        self.name = name
        self.description = description
        self.type = type
        self.attribute = attribute
        self.path = path
        self.data = data

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if "name" not in adict:
            invalid_req.add_error("name", "is missing")

        if "type" not in adict:
            invalid_req.add_error("type", "is missing")

        if "attribute" not in adict:
            invalid_req.add_error("attribute", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(
            parent_id=adict.get("parentId"),
            name=adict.get("name"),
            description=adict.get("description", ""),
            type=adict.get("type"),
            attribute=adict.get("attribute"),
            path=adict.get("path", ""),
            data=adict.get("data", None),
        )


class BlueprintProvider:
    def __init__(self, document_repository):
        self.document_repository = document_repository

    def get_blueprint(self, type: str):
        return get_blueprint(type)


class AddFileUseCase(uc.UseCase):
    def __init__(self, document_repository: Repository):
        self.document_repository = document_repository
        self.blueprint_provider = BlueprintProvider(document_repository=self.document_repository)

    def process_request(self, request_object: AddFileRequestObject):
        parent_id: str = request_object.parent_id
        name: str = request_object.name
        type: str = request_object.type
        description: str = request_object.description
        attribute_dot_path = request_object.attribute

        document_service = DocumentService(document_repository=self.document_repository)
        document = document_service.add_document(
            parent_id=parent_id, type=type, name=name, description=description, attribute_dot_path=attribute_dot_path
        )

        return res.ResponseSuccess(document)

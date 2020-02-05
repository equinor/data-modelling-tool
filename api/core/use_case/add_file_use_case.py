from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.service.document_service import DocumentService

from core.repository.repository_factory import get_repository


class AddFileRequestObject(req.ValidRequestObject):
    def __init__(
        self,
        data_source_id=None,
        parent_id=None,
        name=None,
        description=None,
        type=None,
        attribute=None,
        path=None,
        data=None,
    ):
        self.data_source_id = data_source_id
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

        if "data_source_id" not in adict:
            invalid_req.add_error("data_source_id", "is missing")

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
            data_source_id=adict.get("data_source_id"),
            parent_id=adict.get("parentId"),
            name=adict.get("name"),
            description=adict.get("description", ""),
            type=adict.get("type"),
            attribute=adict.get("attribute"),
            path=adict.get("path", ""),
            data=adict.get("data", None),
        )


class AddFileUseCase(uc.UseCase):
    def __init__(self, repository_provider=get_repository):
        self.repository_provider = repository_provider

    def process_request(self, request_object: AddFileRequestObject):
        data_source_id = request_object.data_source_id
        parent_id: str = request_object.parent_id
        name: str = request_object.name
        type: str = request_object.type
        description: str = request_object.description
        attribute_dot_path = request_object.attribute

        document_service = DocumentService(repository_provider=self.repository_provider)
        document = document_service.add_document(
            data_source_id=data_source_id,
            parent_id=parent_id,
            type=type,
            name=name,
            description=description,
            attribute_path=attribute_dot_path,
        )

        return res.ResponseSuccess(document)

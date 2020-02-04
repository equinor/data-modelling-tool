from core.repository.repository_factory import get_repository
from core.service.document_service import DocumentService
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc


class RenameAttributeRequestObject(req.ValidRequestObject):
    def __init__(self, data_source_id=None, name=None, parent_id=None, attribute=None):
        self.data_source_id = data_source_id
        self.name = name
        self.parent_id = parent_id
        self.attribute = attribute

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "data_source_id" not in adict:
            invalid_req.add_error("data_source_id", "is missing")

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if "name" not in adict:
            invalid_req.add_error("name", "is missing")

        if "attribute" not in adict:
            invalid_req.add_error("attribute", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(
            data_source_id=adict.get("data_source_id"),
            name=adict.get("name"),
            parent_id=adict.get("parentId"),
            attribute=adict.get("attribute"),
        )


class RenameAttributeUseCase(uc.UseCase):
    def __init__(self, repository_provider=get_repository):
        self.repository_provider = repository_provider

    def process_request(self, request_object: RenameAttributeRequestObject):
        data_source_id: str = request_object.data_source_id
        name = request_object.name
        parent_id = request_object.parent_id
        attribute = request_object.attribute

        document_service = DocumentService(repository_provider=self.repository_provider)
        document = document_service.rename_attribute(data_source_id, parent_id, attribute, name)

        return res.ResponseSuccess(document)

from core.repository.repository_factory import get_repository
from core.service.document_service import DocumentService
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc


class RenameRequestObject(req.ValidRequestObject):
    def __init__(self, data_source_id=None, document_id=None, name=None, parent_id=None):
        self.data_source_id = data_source_id
        self.document_id = document_id
        self.name = name
        self.parent_id = parent_id

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "data_source_id" not in adict:
            invalid_req.add_error("data_source_id", "is missing")

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if "documentId" not in adict:
            invalid_req.add_error("documentId", "is missing")

        if "name" not in adict:
            invalid_req.add_error("name", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(
            data_source_id=adict.get("data_source_id"),
            document_id=adict.get("documentId"),
            name=adict.get("name"),
            parent_id=adict.get("parentId"),
        )


class RenameUseCase(uc.UseCase):
    def __init__(self, repository_provider=get_repository):
        self.repository_provider = repository_provider

    def process_request(self, request_object: RenameRequestObject):
        data_source_id = request_object.data_source_id
        document_id = request_object.document_id
        name = request_object.name
        parent_id = request_object.parent_id

        document_service = DocumentService(repository_provider=self.repository_provider)
        document = document_service.rename_document(
            data_source_id=data_source_id, document_id=document_id, parent_uid=parent_id, name=name
        )
        document_service.invalidate_cache()
        return res.ResponseSuccess(document)

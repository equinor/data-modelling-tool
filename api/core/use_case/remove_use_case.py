from core.repository.repository_factory import get_repository
from core.service.document_service import DocumentService
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc


class RemoveFileRequestObject(req.ValidRequestObject):
    def __init__(self, data_source_id=None, parent_id=None, document_id=None):
        self.data_source_id = data_source_id
        self.parent_id = parent_id
        self.document_id = document_id

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "data_source_id" not in adict:
            invalid_req.add_error("data_source_id", "is missing")

        if "documentId" not in adict:
            invalid_req.add_error("documentId", "is missing")

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(
            data_source_id=adict.get("data_source_id"),
            parent_id=adict.get("parentId"),
            document_id=adict.get("documentId"),
        )


class RemoveUseCase(uc.UseCase):
    def __init__(self, repository_provider=get_repository):
        self.repository_provider = repository_provider

    def process_request(self, request_object):
        data_source_id: str = request_object.data_source_id
        document_id: str = request_object.document_id
        split_parent_id: str = request_object.parent_id.split(".") if request_object.parent_id else None
        parent_id = None
        if split_parent_id:
            parent_id = split_parent_id[0]

        document_service = DocumentService(repository_provider=self.repository_provider)
        document_service.remove_document(data_source_id, document_id, parent_id)

        return res.ResponseSuccess(True)

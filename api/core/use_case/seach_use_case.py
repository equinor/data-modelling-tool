from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.service.document_service import DocumentService

from core.repository.repository_factory import get_repository


class SearchRequestObject(req.ValidRequestObject):
    def __init__(self, data_source_id=None, data=None):
        self.data_source_id = data_source_id
        self.data = data

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "data_source_id" not in adict:
            invalid_req.add_error("data_source_id", "is missing")

        if "data" not in adict:
            invalid_req.add_error("data", "is missing")

        if "type" not in adict["data"]:
            invalid_req.add_error("type", "is missing from the query")

        if invalid_req.has_errors():
            return invalid_req

        return cls(data_source_id=adict.get("data_source_id"), data=adict.get("data"))


class SearchUseCase(uc.UseCase):
    def __init__(self, repository_provider=get_repository):
        self.repository_provider = repository_provider

    def process_request(self, request_object: SearchRequestObject):
        data_source_id = request_object.data_source_id
        search_data = request_object.data

        document_service = DocumentService(repository_provider=self.repository_provider)
        search_results = document_service.search(data_source_id=data_source_id, search_data=search_data)
        return res.ResponseSuccess(search_results)

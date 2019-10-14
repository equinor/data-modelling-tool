from core.repository.data_source_repository import DataSourceRepository
from core.shared import request_object, response_object, use_case
from core.enums import DataSourceDocumentType


class GetDataSourcesUseCaseRequestObject(request_object.ValidRequestObject):
    def __init__(self, document_type: str = None, client_id: str = ""):
        self.data_source_document_type: str = document_type
        self.client_id = client_id

    @classmethod
    def from_dict(cls, request_args: dict):
        invalid_req = request_object.InvalidRequestObject()

        if not DataSourceDocumentType.has_value(request_args.get("documentType", "")):
            invalid_req.add_error("documentType", "is missing or wrong type. Hint: blueprints or entities")

        if invalid_req.has_errors():
            return invalid_req

        return GetDataSourcesUseCaseRequestObject(request_args["documentType"], request_args.get("clientId", ""))


class GetDataSourcesUseCase(use_case.UseCase):
    def __init__(self,):
        self.data_source_repository = DataSourceRepository()

    def process_request(self, request_object: GetDataSourcesUseCaseRequestObject):
        data_source_document_type = request_object.data_source_document_type
        self.data_source_repository.ensure_user_data_source_exists(request_object.client_id)
        data_sources = self.data_source_repository.list(DataSourceDocumentType(data_source_document_type))
        return response_object.ResponseSuccess(data_sources)

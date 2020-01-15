from core.shared import request_object, response_object, use_case
from core.enums import DataSourceDocumentType


class GetDataSourcesUseCaseRequestObject(request_object.ValidRequestObject):
    def __init__(self, document_type: DataSourceDocumentType = None):
        self.data_source_document_type: DataSourceDocumentType = document_type

    @classmethod
    def from_dict(cls, request_args: dict):
        invalid_req = request_object.InvalidRequestObject()
        doc_type_arg = request_args.get("documentType", "all")
        data_source_type = "^(blueprints|entities)$" if doc_type_arg == "all" else doc_type_arg
        if not DataSourceDocumentType.has_value(data_source_type):
            invalid_req.add_error("documentType", "is missing or wrong type. Hint: 'blueprints', 'entities', or 'all'")

        if invalid_req.has_errors():
            return invalid_req

        return GetDataSourcesUseCaseRequestObject(DataSourceDocumentType(data_source_type))


class GetDataSourcesUseCase(use_case.UseCase):
    def __init__(self, data_source_repository):
        self.data_source_repository = data_source_repository

    def process_request(self, request_object: GetDataSourcesUseCaseRequestObject):
        data_sources = self.data_source_repository.list(request_object.data_source_document_type)
        return response_object.ResponseSuccess(data_sources)

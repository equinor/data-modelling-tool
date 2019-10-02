from core.shared import request_object, response_object, use_case
from rest.validators.mongo_data_source import validate_mongo_data_source
from utils.enums import DataSourceType


class CreateDataSourceRequestObject(request_object.ValidRequestObject):
    def __init__(self, data_source_id: str, form_data: dict):
        self.data_source_id = data_source_id
        self.form_data = form_data

    @classmethod
    def from_dict(cls, request_data: dict):
        invalid_req = request_object.InvalidRequestObject()

        if not request_data.get("formData", None):
            invalid_req.add_error("Missing parameter", "There is no data in the request")

        if not DataSourceType.has_value(request_data["formData"].get("type", "")):
            invalid_req.add_error(
                "Schema validation",
                f"The data source is not a valid type. Valid types are; {[item.value for item in DataSourceType]}",
            )

        if request_data["formData"].get("type", "") == DataSourceType.MONGO.value:
            validation = validate_mongo_data_source(request_data["formData"])
            if validation:
                invalid_req.add_error("Schema validation", validation.message)

        if invalid_req.has_errors():
            return invalid_req

        return CreateDataSourceRequestObject(
            data_source_id=request_data["dataSourceId"], form_data=request_data["formData"]
        )


class CreateDataSourceUseCase(use_case.UseCase):
    def __init__(self, data_source_repository):
        self.data_source_repository = data_source_repository

    def process_request(self, request_obj: CreateDataSourceRequestObject):
        response = self.data_source_repository.create(request_obj.data_source_id, request_obj.form_data)
        return response_object.ResponseSuccess(response)

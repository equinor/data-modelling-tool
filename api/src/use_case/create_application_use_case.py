from services.application_service import ApplicationService
from services.document_service import DocumentService
from restful import request_object as req
from restful import response_object
from restful import use_case as uc


class CreateApplicationRequestObject(req.ValidRequestObject):
    def __init__(self, application_id=None):
        self.application_id = application_id

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "applicationId" not in adict:
            invalid_req.add_error("applicationId", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(application_id=adict.get("applicationId"))


class CreateApplicationUseCase(uc.UseCase):
    def __init__(self, data_source_id):
        self.data_source_id = data_source_id

    def process_request(self, request_object: CreateApplicationRequestObject):
        document_service = DocumentService()
        application_service = ApplicationService(document_service)
        return response_object.ResponseSuccess(
            application_service.create_application(self.data_source_id, request_object.application_id)
        )

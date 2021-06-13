from restful import response_object as res
from restful import use_case as uc
from services.document_service import DocumentService
from services.application_service import ApplicationService

class InstantiateEntityUseCase(uc.UseCase):
    def process_request(self, request_object):
        application_service = ApplicationService(DocumentService())
        document = application_service.instantiate_entity(request_object["type"], request_object["name"])
        return res.ResponseSuccess(document)

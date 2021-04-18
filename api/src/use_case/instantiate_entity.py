from restful import response_object as res
from restful import use_case as uc
from services.document_service import DocumentService


class InstantiateEntityUseCase(uc.UseCase):
    def process_request(self, request_object):
        document_service = DocumentService()
        document = document_service.instantiate_entity(request_object["type"], request_object["name"])
        return res.ResponseSuccess(document)

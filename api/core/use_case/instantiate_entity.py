from core.shared import response_object as res
from core.shared import use_case as uc
from core.service.document_service import DocumentService


class InstantiateEntityUseCase(uc.UseCase):
    def process_request(self, request_object):
        document_service = DocumentService()
        document = document_service.instantiate_entity(request_object["type"], request_object["name"])
        return res.ResponseSuccess(document)

from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.service.document_service import DocumentService

from core.repository.repository_factory import get_repository


class CreateEntityUseCase(uc.UseCase):
    def __init__(self, repository_provider=get_repository):
        self.repository_provider = repository_provider

    def process_request(self, request_object):
        document_service = DocumentService(repository_provider=self.repository_provider)
        document = document_service.get_entity(request_object["type"], request_object["name"])
        return res.ResponseSuccess(document)

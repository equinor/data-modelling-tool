from typing import Dict

from restful import request_object as req
from restful import response_object as res
from restful import use_case as uc
from services.application_service import ApplicationService
from services.document_service import DocumentService


class GetRelatedBlueprintsRequestObject(req.ValidRequestObject):
    def __init__(self, blueprint):
        self.blueprint = blueprint


class GetRelatedBlueprintsUseCase(uc.UseCase):
    def process_request(self, request_object: GetRelatedBlueprintsRequestObject):
        blueprint: str = request_object.blueprint
        application_service = ApplicationService(DocumentService())
        related_blueprints: Dict = application_service.get_related_blueprints(blueprint)

        return res.ResponseSuccess(related_blueprints)

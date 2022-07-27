from restful import use_case as uc
from services.document_service import DocumentService
from services.application_service import ApplicationService
from pydantic import BaseModel
from starlette.responses import JSONResponse

# todo define as an entity instead?
class BasicEntity(BaseModel):
    name: str
    type: str


class InstantiateEntityUseCase(uc.UseCase):
    def process_request(self, request_object: BasicEntity):
        application_service = ApplicationService(DocumentService())
        document = application_service.instantiate_entity(request_object.type, request_object.name)
        return JSONResponse(document)

from services.document_service import DocumentService
from services.application_service import ApplicationService
from pydantic import BaseModel


class BasicEntity(BaseModel):
    name: str
    type: str


def instantiate_entity_use_case(basic_entity: BasicEntity) -> dict:
    application_service = ApplicationService(DocumentService())
    document: dict = application_service.instantiate_entity(basic_entity.type, basic_entity.name)
    return document

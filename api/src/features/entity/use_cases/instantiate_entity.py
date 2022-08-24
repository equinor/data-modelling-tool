from typing import Optional

from pydantic import BaseModel
from pydantic.config import Extra

from services.application_service import ApplicationService
from services.document_service import DocumentService


class BasicEntity(BaseModel, extra=Extra.allow):
    name: Optional[str]
    type: str


def instantiate_entity_use_case(basic_entity: BasicEntity) -> dict:
    application_service = ApplicationService(DocumentService())
    document: dict = application_service.instantiate_entity(basic_entity.dict())
    return document

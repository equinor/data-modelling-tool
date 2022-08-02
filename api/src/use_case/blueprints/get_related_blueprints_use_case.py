from services.application_service import ApplicationService
from services.document_service import DocumentService


def get_related_blueprints_use_case(target_blueprint: str) -> dict:
    application_service = ApplicationService(DocumentService())
    related_blueprints: dict = application_service.get_related_blueprints(target_blueprint)
    return related_blueprints


# TODO add services as input to use case?

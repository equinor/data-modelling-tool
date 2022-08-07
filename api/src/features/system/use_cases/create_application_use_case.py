from services.application_service import ApplicationService
from services.document_service import DocumentService


def create_application_use_case(data_source_id: str, application_id: str):
    application_service = ApplicationService(DocumentService())
    return application_service.create_application(data_source_id, application_id)

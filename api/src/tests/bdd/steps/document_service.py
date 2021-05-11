from behave import given, then

from services.document_service import DocumentService


@given("i create a document service")
def step_impl(context):
    document_service = DocumentService()
    context.documentService = document_service


@given('i export document with id "{uid}" in data source "{data_source_id}"')
def step_impl(context, uid: str, data_source_id: str):
    context.documentService.uid_document_provider(data_source_id, uid)

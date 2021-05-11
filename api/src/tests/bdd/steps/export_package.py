from behave import given, then

from services.document_service import DocumentService


@given("i create a document service")
def step_impl(context):
    document_service = DocumentService()
    context.document_service = document_service


@given('i export document with id "{uid}" in data source "{data_source_id}"')
def step_impl(context, uid: str, data_source_id: str):
    memory_file = context.document_service.create_zip_export(data_source_id, uid)
    context.memory_file = memory_file


@then("memory_file in context should not be empty")
def step_impl(context):
    assert context.memory_file.getbuffer().nbytes > 0

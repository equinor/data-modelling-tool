from behave import given, then

from services.document_service import DocumentService
from domain_classes.tree_node import Node


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


@given('i call the function get_node_with_id using id "{uid}" in data source "{data_source_id}"')
def step_impl(context, uid: str, data_source_id: str):
    node: Node = context.document_service.get_node_by_uid(data_source_id, uid)
    context.node = node


@then('node returned should contain node_id "{node_id}" and name "{name}"')
def step_impl(context, node_id: str, name: str):
    assert context.node.node_id == node_id and context.node.name == name

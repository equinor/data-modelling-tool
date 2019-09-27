from behave import given
from app import init_import_internal, import_documents
from services.database import data_modelling_tool_db


@given("data modelling tool templates are imported")
def step_impl(context):
    init_import_internal("templates")
    import_documents("dmt-templates", data_modelling_tool_db)

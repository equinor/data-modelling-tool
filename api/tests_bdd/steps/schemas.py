from behave import given
from app import init_import_internal


@given("data modelling tool templates are imported")
def step_impl(context):
    init_import_internal("templates")

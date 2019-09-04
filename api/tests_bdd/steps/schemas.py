from behave import given
from app import init_import_internal


@given("init import is done")
def step_impl(context):
    init_import_internal("templates")

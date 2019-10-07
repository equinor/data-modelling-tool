import json

from behave import given, when, then
from core.domain.schema import Factory
from core.repository.file.document_repository import TemplateRepositoryFromFile
from tests_bdd.steps.handle_response import pretty_eq
from utils.helper_functions import schemas_location
from config import Config
from services.database import data_modelling_tool_db
from utils.package_import import import_package


@given("data modelling tool templates are imported")
def step_impl(context):
    for folder in Config.SYSTEM_FOLDERS:
        import_package(f"{Config.APPLICATION_HOME}/core/{folder}", collection=Config.SYSTEM_COLLECTION)


@given('there exist document with id "{uid}" in data source "{collection}"')
def step_impl_2(context, uid: str, collection: str):
    document = json.loads(context.text)
    data_modelling_tool_db[collection].replace_one({"_id": uid}, document, upsert=True)


@when('I create a Python class from the template "{template_name}"')
def step_impl_create_template(context, template_name: str):
    document_repository = TemplateRepositoryFromFile(schemas_location())
    factory = Factory(document_repository)
    context.template_name = template_name
    context.template = factory.create(template_name)


@then("it should be able to recreate the template")
def step_impl_compare(context):
    expected = TemplateRepositoryFromFile(schemas_location()).get(context.template_name)
    actual = context.template.to_dict()
    pretty_eq(expected, actual)

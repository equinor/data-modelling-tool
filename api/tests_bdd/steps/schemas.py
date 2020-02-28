import json

from behave import given, when, then

from classes.schema import Factory
from core.repository import Repository
from core.repository.file import TemplateRepositoryFromFile
from core.repository.repository_factory import get_repository
from utils.data_structure.compare import pretty_eq
from utils.helper_functions import schemas_location
from utils.logging import logger
from utils.package_import import import_package

from classes.dto import DTO
from config import Config


@given("data modelling tool templates are imported")
def step_impl(context):
    for folder in Config.SYSTEM_FOLDERS:
        logger.setLevel("ERROR")
        import_package(f"{Config.APPLICATION_HOME}/core/{folder}", collection=Config.SYSTEM_COLLECTION, is_root=True)
        logger.setLevel("INFO")


@given('there exist document with id "{uid}" in data source "{data_source_id}"')
def step_impl_2(context, uid: str, data_source_id: str):
    document: DTO = DTO(uid=uid, data=json.loads(context.text))
    document_repository: Repository = get_repository(data_source_id)
    document_repository.add(document)


@when('I create a Python class from the template "{template_name}"')
def step_impl_create_template(context, template_name: str):
    document_repository = TemplateRepositoryFromFile(schemas_location())
    factory = Factory(document_repository, read_from_file=True)
    context.template_name = template_name
    context.template = factory.create(template_name)


@then("it should be able to recreate the template")
def step_impl_compare(context):
    expected = TemplateRepositoryFromFile(schemas_location()).get(context.template_name)
    actual = context.template.to_dict()
    pretty_eq(expected, actual)

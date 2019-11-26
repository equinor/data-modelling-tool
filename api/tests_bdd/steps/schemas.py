import json

from behave import given, when, then

from classes.data_source import DataSource
from core.domain.dto import DTO
from core.domain.schema import Factory
from core.repository.file.document_repository import TemplateRepositoryFromFile
from core.repository.interface.document_repository import DocumentRepository
from core.repository.repository_factory import get_repository
from tests_bdd.steps.handle_response import pretty_eq
from utils.helper_functions import schemas_location
from config import Config
from utils.package_import import import_package


@given("data modelling tool templates are imported")
def step_impl(context):
    for folder in Config.SYSTEM_FOLDERS:
        import_package(f"{Config.APPLICATION_HOME}/core/{folder}", collection=Config.SYSTEM_COLLECTION, is_root=True)


@given('there exist document with id "{uid}" in data source "{data_source_id}"')
def step_impl_2(context, uid: str, data_source_id: str):
    data_source = DataSource(id=data_source_id)
    document: DTO[dict] = DTO(uid=uid, data=json.loads(context.text))
    document_repository: DocumentRepository = get_repository(data_source)
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

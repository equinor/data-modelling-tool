import json

from behave import given, then, when
from utils.package_import import import_package

from classes.dto import DTO
from classes.schema import Factory
from config import Config
from utils.data_structure.compare import pretty_eq
from utils.helper_functions import schemas_location
from utils.logging import logger
from services.data_modelling_document_service import document_api, explorer_api, package_api, datasource_api


@given("data modelling tool templates are imported")
def step_impl(context):
    for folder in Config.SYSTEM_FOLDERS:
        logger.setLevel("ERROR")
        import_package(f"{Config.APPLICATION_HOME}/core/{folder}", collection=Config.SYSTEM_COLLECTION, is_root=True)
        logger.setLevel("INFO")


@given('there exist document with id "{uid}" in data source "{data_source_id}"')
def step_impl_2(context, uid: str, data_source_id: str):
    document: DTO = DTO(uid=uid, data=json.loads(context.text))
    response = explorer_api.add_raw(data_source_id, document.to_dict())
    print(response)


class TemplateRepositoryFromDMSS:
    def get(self, template_type: str):
        return self[template_type]

    def __getitem__(self, template_type: str) -> dict:
        data_source, *rest = template_type.split("/")
        template_type = "/".join(rest)
        document = document_api.get_by_path(data_source, template_type)
        return document["document"]


@when('I create a Python class from the template "{template_name}"')
def step_impl_create_template(context, template_name: str):
    document_repository = TemplateRepositoryFromDMSS()
    factory = Factory(document_repository)
    context.template_name = template_name
    context.template = factory.create(template_name)


@then("it should be able to recreate the template")
def step_impl_compare(context):
    expected = TemplateRepositoryFromDMSS().get(context.template_name)
    actual = context.template.to_dict()
    # TODO: Why do we need to remove _id
    del expected["_id"]
    pretty_eq(expected, actual)

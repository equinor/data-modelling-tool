import json

import io
from behave import given, then, when
from zipfile import ZipFile

from domain_classes.dto import DTO
from domain_classes.schema import Factory
from config import Config
from repository.dmss.TemplateRepositoryFromDMSS import TemplateRepositoryFromDMSS
from services.dmss import dmss_api
from use_case.import_package import import_package_tree, package_tree_from_zip
from utils.create_application_utils import zip_all
from utils.data_structure.compare import pretty_eq


@given("data modelling tool blueprints are imported")
def step_impl(context):
    with open("./home/DMT/data_sources/DMT.json") as file:
        document = json.load(file)
        dmss_api.data_source_save(document["name"], data_source_request=document)
    memory_file = io.BytesIO()
    with ZipFile(memory_file, mode="w") as zip_file:
        zip_all(zip_file, f"{Config.APPLICATION_HOME}/data/DMT-internals/DMT", write_folder=False)
    memory_file.seek(0)
    root_package = package_tree_from_zip("DMT-Internal", "DMT", memory_file)
    import_package_tree(root_package, "DMT-Internal")


@given('there exist document with id "{uid}" in data source "{data_source_id}"')
def step_impl_2(context, uid: str, data_source_id: str):
    document: DTO = DTO(uid=uid, data=json.loads(context.text))
    response = dmss_api.explorer_add_raw(data_source_id, document.to_dict())
    print(response)


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

import io
import json
from zipfile import ZipFile

from behave import given

from config import Config
from services.dmss import dmss_api
from utils.create_application_utils import zip_all
from utils.import_package import import_package_tree, package_tree_from_zip


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
    document: dict = json.loads(context.text)
    document["_id"] = uid
    dmss_api.explorer_add_simple(data_source_id, document)

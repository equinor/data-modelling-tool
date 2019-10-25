import json

from behave import given
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

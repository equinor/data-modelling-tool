from behave import given
from app import import_folder
from config import Config


@given("data modelling tool templates are imported")
def step_impl(context):
    for folder in Config.SYSTEM_FOLDERS:
        import_folder(f"{Config.APPLICATION_HOME}/core/{folder}", contained=True, collection=Config.SYSTEM_COLLECTION)

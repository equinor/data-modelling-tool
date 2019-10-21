from behave import given
from app import import_folder, import_application_settings
from config import Config


@given("data modelling tool templates are imported")
def step_impl(context):
    application_settings = import_application_settings()
    for folder in application_settings["core"]:
        print(f"Importing {folder}")
        import_folder(f"{Config.APPLICATION_HOME}/core/{folder}", contained=True, collection=Config.SYSTEM_COLLECTION)

from behave import given
from app import import_folder, BLUEPRINT_PACKAGES


@given("data modelling tool templates are imported")
def step_impl(context):
    import_folder(contained=True, folder=BLUEPRINT_PACKAGES[1], collection="templates")
    import_folder(contained=True, folder=BLUEPRINT_PACKAGES[2], collection="templates")

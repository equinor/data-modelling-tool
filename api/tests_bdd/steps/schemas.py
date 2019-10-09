from behave import given
from app import import_folder, PACKAGE_PATHS


@given("data modelling tool templates are imported")
def step_impl(context):
    import_folder(uncontained=True, folder=PACKAGE_PATHS[1])
    import_folder(uncontained=True, folder=PACKAGE_PATHS[2])

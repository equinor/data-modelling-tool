from app import create_app, init_import_internal
from tests_bdd.results import print_overview_features
from config import Config
from services.database import data_modelling_tool_db, model_db

app = create_app(Config)
app.config['TESTING'] = True

def clear_databases():
    for name in ["documents", "templates"]:
        print(f"Dropping collection '{name}'")
        model_db.drop_collection(name)
        data_modelling_tool_db.drop_collection(name)

def before_all(context):
    context.errors = []
    context.features = []
    clear_databases()
    init_import_internal()

def after_all(context):
    print_overview_features(context.features)


def after_feature(context, feature):
    context.features.append(feature)


def before_scenario(context, scenario):
    context.client = app.test_client()
    context.ctx = app.test_request_context()
    context.ctx.push()


def after_scenario(context, scenario):
    clear_databases()
    context.ctx.pop()


def after_step(context, step):
    if step.status == 'failed':
        context.errors.append(step)

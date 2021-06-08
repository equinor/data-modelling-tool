from pymongo import MongoClient

from app import create_app
from config import Config
from tests.bdd.results import print_overview_errors, print_overview_features

app = create_app(Config)
app.config["TESTING"] = True
app.config["PRESERVE_CONTEXT_ON_EXCEPTION"] = False
app.config["CACHE_MAX_SIZE"] = 0

client = MongoClient("db", username=Config.MONGO_USERNAME, password=Config.MONGO_PASSWORD)
dmt_database = client[Config.MONGO_DB]


def wipe_added_data_sources(context):
    for data_source in context.data_sources.values():
        dmt_database.drop_collection(data_source)


def before_all(context):
    context.errors = []
    context.features = []


def after_all(context):
    print_overview_features(context.features)
    print_overview_errors(context.errors)


def after_feature(context, feature):
    if "skip" in feature.tags:
        feature.skip("Marked with @skip")
    context.features.append(feature)


def before_scenario(context, scenario):
    if "skip" in scenario.effective_tags:
        scenario.skip("Marked with @skip")

    context.client = app.test_client()
    context.ctx = app.test_request_context()
    context.ctx.push()


def after_scenario(context, scenario):
    if "data_sources" in context:
        wipe_added_data_sources(context)
    context.ctx.pop()


def after_step(context, step):
    if step.status == "failed":
        context.errors.append(step)
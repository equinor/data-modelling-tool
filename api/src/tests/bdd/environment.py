from pymongo import MongoClient

from app import create_app
from config import Config
from tests.bdd.results import print_overview_errors, print_overview_features
from tests.bdd.steps.data_source import data_source_collection_client

app = create_app(Config)
app.config["TESTING"] = True
app.config["PRESERVE_CONTEXT_ON_EXCEPTION"] = False
app.config["CACHE_MAX_SIZE"] = 0

client = MongoClient("db", username=Config.MONGO_USERNAME, password=Config.MONGO_PASSWORD)


def wipe_db():
    databases = client.list_database_names()
    # Don't delete the mongo admin or local database. Also, don't delete the CORE datasource
    databases = [n for n in databases if n not in ("admin", "local", "dmss-internal", "DMSS-core")]
    for db_name in databases:
        client.drop_database(db_name)
    # Delete all "extra" data sources
    data_source_collection_client.delete_many({"_id": {"$ne": "system"}})


def before_all(context):
    context.errors = []
    context.features = []
    wipe_db()


def after_all(context):
    print_overview_features(context.features)
    print_overview_errors(context.errors)
    wipe_db()


def after_feature(context, feature):
    if "skip" in feature.tags:
        feature.skip("Marked with @skip")
    context.features.append(feature)


def before_scenario(context, scenario):
    wipe_db()
    if "skip" in scenario.effective_tags:
        scenario.skip("Marked with @skip")

    context.client = app.test_client()
    context.ctx = app.test_request_context()
    context.ctx.push()


def after_step(context, step):
    if step.status == "failed":
        context.errors.append(step)

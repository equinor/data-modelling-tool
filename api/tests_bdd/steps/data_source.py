from behave import *
from data_source_plugins.mongodb import MongodbClient

# TODO: Find out how we want to do this logic. How to connect to clients. Should we use DataSource class?

DATA_SOURCES = {
    "mongo": {
        "type": "mongodb",
        "host": "db",
        "port": 27017,
        "username": "maf",
        "password": "maf",
        "tls": False,
        "name": "latest-correct",
        "database": "maf",
        "collection": "blueprints",
        "documentType": "blueprints"
    }
}


@given('i access the data source "{data_source_type}"')
def step_impl(context, data_source_type: str):
    if data_source_type == "mongo":
        client = MongodbClient(
            host=data_source_type[data_source_type].host,
            username=data_source_type[data_source_type].username,
            password=data_source_type[data_source_type].password,
            collection=data_source_type[data_source_type].collection,
            port=data_source_type[data_source_type].port,
            database=data_source_type[data_source_type].database,
        )
        context.data_source = client

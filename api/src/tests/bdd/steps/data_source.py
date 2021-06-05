from behave import given
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

from services.dmss import dmss_api

data_source_collection_client = MongoClient("db", username="maf", password="maf")["data-source-database"][
    "data_sources"
]
mongo_client = MongoClient("db", username="maf", password="maf")


@given("there are basic data sources with repositories")
def create_repositories(context):
    context.data_sources = {}
    # First, add data sources
    for row in context.table:
        document = {"_id": row["name"], "name": row["name"]}
        try:
            data_source_collection_client.insert_one(document)
        except DuplicateKeyError:
            pass
    # Then add repositories with default values to the data sources
    for row in context.table:
        document = {
            "data_types": ["default"],
            "host": "db",
            "port": 27017,
            "username": "maf",
            "password": "maf",
            "tls": "false",
            "database": row["name"],
            "collection": row["name"],
            "type": "mongo-db",
        }

        data_source_collection_client.update_one(
            {"_id": row["name"]}, {"$set": {f"repositories.{row['name']}": document}}
        )
        context.data_sources[row["name"]] = row["name"]

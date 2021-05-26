from behave import given
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

from services.dmss import dmss_api

db_client = MongoClient("db", username="maf", password="maf")["local"]


@given("there are mongodb data sources")
def step_impl(context):
    context.data_sources = {}
    for row in context.table:
        # Delete old dataSource
        db_client["data_sources"].delete_one({"_id": row["name"]})
        document = {
            "name": row["name"],
            "repositories": {
                f"{row['name']}": {
                    "host": row["host"],
                    "port": int(row["port"]),
                    "username": row["username"],
                    "password": row["password"],
                    "tls": False,
                    "database": row["database"],
                    "collection": row["collection"],
                    "type": row["type"],
                }
            },
        }
        dmss_api.data_source_save(str(row["name"]), data_source_request=document)
        db_client.drop_collection(row["collection"])
        context.data_sources[row["name"]] = row["collection"]


@given("there are basic data sources with repositories")
def create_repositories(context):
    context.data_sources = {}
    # First, add data sources
    for row in context.table:
        document = {"_id": row["name"], "name": row["name"]}
        try:
            db_client["data_sources"].insert_one(document)
        except DuplicateKeyError:
            pass
    # Then add repositories with default values to the data sources
    for row in context.table:
        document = {
            "dataTypes": ["default"],
            "host": "db",
            "port": 27017,
            "username": "maf",
            "password": "maf",
            "tls": "false",
            "database": "local",
            "collection": row["name"],
            "type": "mongo-db",
        }

        db_client["data_sources"].update_one({"_id": row["name"]}, {"$set": {f"repositories.{row['name']}": document}})
        db_client.drop_collection(row["name"])
        context.data_sources[row["name"]] = row["name"]

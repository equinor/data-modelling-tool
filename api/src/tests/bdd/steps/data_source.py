from behave import given
from pymongo import MongoClient

from services.dmss import dmss_api

data_source_collection_client = MongoClient("db", username="maf", password="maf")["data-source-database"][
    "data_sources"
]
mongo_client = MongoClient("db", username="maf", password="maf")


@given("there are basic data sources with repositories")
def create_repositories(context):
    for row in context.table:
        repositories = {
            row["name"]: {
                "data_types": ["default"],
                "host": "db",
                "port": 27017,
                "username": "maf",
                "password": "maf",
                "tls": False,
                "database": row["name"],
                "collection": row["name"],
                "type": "mongo-db",
            }
        }

        dmss_api.data_source_save(row["name"], {"name": row["name"], "repositories": repositories})

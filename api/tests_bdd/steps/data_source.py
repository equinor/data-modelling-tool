from behave import given
from pymongo import MongoClient

from config import Config

from dmss_api import DatasourceApi

api = DatasourceApi()
api.api_client.configuration.host = Config.DMSS_API

db_client = MongoClient("db", username="maf", password="maf")["local"]


@given("there are mongodb data sources")
def step_impl(context):

    context.data_sources = {}
    for row in context.table:
        # Delete old dataSource
        db_client["data_sources"].remove(row["name"])
        document = {
            "_id": row["name"],
            "name": row["name"],
            "repositories": {
                f"{row['name']}": {
                    "host": row["host"],
                    "port": int(row["port"]),
                    "username": row["username"],
                    "password": row["password"],
                    "tls": row["tls"],
                    "name": row["name"].strip(),
                    "database": row["database"],
                    "collection": row["collection"],
                    "type": row["type"],
                }
            },
        }
        api.save(str(row["name"]), request_body=document)
        db_client.drop_collection(row["collection"])
        context.data_sources[row["name"]] = row["collection"]

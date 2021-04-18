from behave import given
from pymongo import MongoClient

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
                    "name": row["name"].strip(),
                    "database": row["database"],
                    "collection": row["collection"],
                    "type": row["type"],
                }
            },
        }
        dmss_api.data_source_save(str(row["name"]), data_source_request=document)
        db_client.drop_collection(row["collection"])
        context.data_sources[row["name"]] = row["collection"]

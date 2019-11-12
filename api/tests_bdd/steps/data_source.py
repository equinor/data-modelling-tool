from behave import given
from services.database import dmt_database


@given("there are mongodb data sources")
def step_impl(context):
    context.data_sources = {}
    for row in context.table:
        document = {
            "_id": row["name"],
            "host": row["host"],
            "port": int(row["port"]),
            "username": row["username"],
            "password": row["password"],
            "tls": row["tls"],
            "name": row["name"].strip(),
            "database": row["database"],
            "collection": row["collection"],
            "documentType": row["documentType"],
            "type": row["type"],
        }
        dmt_database["data_sources"].insert_one(document)
        dmt_database.drop_collection(row["collection"])
        context.data_sources[row["name"]] = document

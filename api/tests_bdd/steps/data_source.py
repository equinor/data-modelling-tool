from behave import given
from services.database import data_modelling_tool_db


@given("there are mongodb data sources")
def step_impl(context):
    context.cases = {}
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
            "type": "mongodb",
        }
        data_modelling_tool_db["data_sources"].insert_one(document)

from flask import abort

from data_source_plugins.mongodb import MongodbClient
from services.database import dmt_database as db


def get_data_source_from_database(id):
    data_source = db.data_sources.find_one({"_id": id})
    if not data_source:
        abort(404, f"Error: The data-source was not found. ID: {id}")
    return data_source


class DataSource:
    def __init__(self, id: str):
        data_source_dict = get_data_source_from_database(id)

        self.id = id
        self.type = data_source_dict["type"]
        self.host = data_source_dict["host"]
        self.port = data_source_dict["port"]
        self.username = data_source_dict["username"]
        self.password = data_source_dict["password"]
        self.tls = data_source_dict.get("tls", False)
        self.name = data_source_dict["name"]
        self.database = data_source_dict["database"]
        self.collection = data_source_dict["collection"]
        self.documentType = data_source_dict["documentType"]


def get_client(datasource: DataSource) -> MongodbClient:
    return MongodbClient(
        host=datasource.host,
        port=datasource.port,
        username=datasource.username,
        password=datasource.password,
        tls=datasource.tls,
        collection=datasource.collection,
        database=datasource.database,
    )

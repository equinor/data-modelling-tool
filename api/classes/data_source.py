from flask import abort

from data_source_plugins.mongodb import MongodbClient
from services.database import data_modelling_tool_db as db


def get_data_source_from_database(_id):
    data_source = db.data_sources.find_one({"_id": _id})
    if not data_source:
        abort(404, "Error: The data-source was not found")
    return data_source


class DataSource:
    def __init__(self, _id: str):
        # TODO: Auth
        data_source_dict = get_data_source_from_database(_id)

        self.type = data_source_dict["type"]
        self.host = data_source_dict["host"]
        self.port = data_source_dict["port"]
        self.username = data_source_dict["username"]
        self.password = data_source_dict["password"]
        self.tls = data_source_dict["tls"]
        self.name = data_source_dict["name"]
        self.database = data_source_dict["database"]
        self.collection = data_source_dict["collection"]
        self.documentType = data_source_dict["documentType"]

        if self.type == "mongodb":
            self.client = MongodbClient(
                host=self.host,
                port=self.port,
                username=self.username,
                password=self.password,
                tls=self.tls,
                collection=self.collection,
                database=self.database,
            )

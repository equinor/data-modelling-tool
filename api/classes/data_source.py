from flask import abort

from data_source_plugins.mongodb import MongodbClient
from services.database import data_modelling_tool_db as db


def get_data_source_from_database(id):
    data_source = db.data_sources.find_one({"_id": id})
    if not data_source:
        abort(404, f"Error: The data-source was not found. ID: {id}")
    return data_source


class MockClient:
    def __init__(self, data):
        self._data = data

    def get_root_packages(self):
        return [item for item in self._data if ("documentType" in item and item["documentType"] == "root-package")]

    def read_form(self, package_name):
        for item in self._data:
            _id = item.get("_id", item.get("id"))
            if _id == package_name:
                return item
        return None


class DataSource:
    @classmethod
    def mock(cls, data):
        inst = cls.__new__(cls)
        inst.client = MockClient(data)
        return inst

    def __init__(self, id: str):
        # TODO: Auth
        data_source_dict = get_data_source_from_database(id)

        self.id = id
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

        if self.type == "mongo-db":
            self.client = MongodbClient(
                host=self.host,
                port=self.port,
                username=self.username,
                password=self.password,
                tls=self.tls,
                collection=self.collection,
                database=self.database,
            )

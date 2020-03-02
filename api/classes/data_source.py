from flask import abort

from services.database import dmt_database as db


class DataSource:
    @staticmethod
    def _get_data_source_from_database(uid):
        data_source = db.data_sources.find_one({"_id": uid})
        if not data_source:
            abort(404, f"Error: The data-source was not found. ID: {uid}")
        return data_source

    def __init__(self, uid: str):
        data_source_dict = self._get_data_source_from_database(uid)

        self.id = uid
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

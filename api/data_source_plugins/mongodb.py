from flask import abort
from pymongo import MongoClient

from utils.logging import logger


class MongodbClient:
    def __init__(
        self,
        host: str,
        username: str,
        password: str,
        database: str,
        collection: str,
        port: int = 27001,
    ):
        self.handler = MongoClient(host=host, port=port, username=username, password=password)[
            database
        ]
        self.collection = collection

    def update_form(self, form, _id):
        return (
            self.handler[self.collection]
            .replace_one({"_id": _id}, form, upsert=True)
            .acknowledged
        )

    def read_form(self, _id):
        result = self.handler[self.collection].find_one(filter={"_id": _id})
        if not result:
            logger.warning(f"The document with id = {_id} was not found.")
            return abort(404)
        else:
            return result

    def create_form(self, form, _id=None):
        if _id:
            form["_id"] = _id
        try:
            return self.handler[self.collection].insert_one(form).inserted_id
        except Exception as error:
            return abort(500, error)

    def get_root_packages(self):
        result = self.handler[self.collection].find(filter={"documentType": "root-package"})
        if not result:
            return abort(404)
        else:
            return [package for package in result]

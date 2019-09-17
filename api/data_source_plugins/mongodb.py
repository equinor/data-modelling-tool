from flask import abort
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

from utils.logging import logger


class MongodbClient:
    def __init__(
        self, host: str, username: str, password: str, database: str, tls: bool, collection: str, port: int = 27001
    ):
        self.handler = MongoClient(
            host=host,
            port=port,
            username=username,
            password=password,
            tls=tls,
            connectTimeoutMS=5000,
            serverSelectionTimeoutMS=5000,
        )[database]
        self.collection = collection

    def update_form(self, form, _id):
        try:
            return (
                self.handler[self.collection]
                .update_one({"_id": _id}, {"$set": {"formData": form}}, upsert=True)
                .acknowledged
            )
        except Exception as error:
            return abort(500, error)

    def append_to_parent(self, form, _id):
        try:
            return self.handler[self.collection].update_one({"_id": _id}, {"$push": form}, upsert=True).acknowledged
        except Exception as error:
            return abort(500, error)

    def pull_from_parent(self, form, _id):
        try:
            return self.handler[self.collection].update_one({"_id": _id}, {"$pull": form}, upsert=True).acknowledged
        except Exception as error:
            return abort(500, error)

    def read_form(self, _id):
        result = self.handler[self.collection].find_one(filter={"_id": _id})
        if not result:
            logger.warning(f"The document with id = {_id} was not found. {self.collection}")
            return abort(404)
        else:
            print(result)
            return result

    def delete_form(self, _id):
        return self.handler[self.collection].delete_one(filter={"_id": _id}).acknowledged

    def create_form(self, form, _id=None):
        if _id:
            form["_id"] = _id
        try:
            return self.handler[self.collection].insert_one(form).inserted_id
        except Exception as error:
            return abort(500, error)

    def get_root_packages(self):
        try:
            result = self.handler[self.collection].find(filter={"meta.documentType": "root-package"})
            return [package for package in result]
        except ServerSelectionTimeoutError as error:
            return abort(500, error._message)

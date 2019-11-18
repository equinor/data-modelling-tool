from flask import abort
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

from core.repository.repository_exceptions import EntityAlreadyExistsException


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

    def update(self, form, _id):
        try:
            return self.handler[self.collection].update_one({"_id": _id}, {"$set": form}, upsert=True).acknowledged
        except Exception as error:
            return abort(500, error)

    def find(self, filter):
        result = self.handler[self.collection].find(filter=filter)
        if not result:
            return abort(404)
        else:
            return result

    def create(self, document):
        document["_id"] = document["id"]
        try:
            self.handler[self.collection].insert_one(document).inserted_id
        except DuplicateKeyError:
            raise EntityAlreadyExistsException(document["id"])

    def find_one(self, filters):
        return self.handler[self.collection].find_one(filter=filters)

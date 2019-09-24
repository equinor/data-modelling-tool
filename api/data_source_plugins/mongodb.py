from flask import abort
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, DuplicateKeyError

from utils.enums import DocumentType
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

    def update_form(self, form, _id):
        try:
            return (
                self.handler[self.collection]
                .update_one({"_id": _id}, {"$set": {"formData": form}}, upsert=True)
                .acknowledged
            )
        except Exception as error:
            return abort(500, error)

    def append_to_parent(self, child_id, id, node_type):
        child_type = f"{node_type.value}s"
        try:
            return (
                self.handler[self.collection]
                .update_one({"_id": id}, {"$push": {f"formData.{child_type}": child_id}}, upsert=True)
                .acknowledged
            )
        except Exception as error:
            return abort(500, error)

    def pull_from_parent(self, child_id, id, node_type):
        child_type = f"{node_type.value}s"
        try:
            return (
                self.handler[self.collection]
                .update_one({"_id": id}, {"$pull": {f"formData.{child_type}": child_id}}, upsert=True)
                .acknowledged
            )
        except Exception as error:
            return abort(500, error)

    def read_form(self, _id):
        result = self.handler[self.collection].find_one(filter={"_id": _id})
        if result:
            result["id"] = _id
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
            result = self.handler[self.collection].find(filter={"meta.documentType": DocumentType.ROOT_PACKAGE.value})
            return [package for package in result]
        except ServerSelectionTimeoutError as error:
            return abort(500, error._message)

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

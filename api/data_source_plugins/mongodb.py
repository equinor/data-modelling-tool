from flask import abort
from pymongo import MongoClient


class MongodbClient:
    def __init__(self, host: str, username: str, password: str, database: str, collection: str, port: int = 27001):
        self.handler = MongoClient(
            host=host,
            port=port,
            username=username,
            password=password,
        )[database]
        self.collection = collection

    def update_form(self, form, _id):
        return self.handler[self.collection].replace_one({'_id': _id}, form, upsert=True)

    def read_form(self, _id):
        return self.handler[self.collection].find_one(filter={'_id': _id})

    def create_form(self, form, _id=None):
        if _id:
            form['_id'] = _id
        try:
            return self.handler[self.collection].insert_one(form)
        except Exception as error:
            return abort(500, error)

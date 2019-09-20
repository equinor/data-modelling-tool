from flask import request
from flask_restful import Resource, abort
from pymongo.errors import DuplicateKeyError

from rest.validators.mongo_data_source import validate_mongo_data_source
from services.database import data_modelling_tool_db as database
from config import Config

collection = database[f"{Config.DATA_SOURCES_COLLECTION}"]


def data_sources_get(document_type: str):
    all_sources = [{"id": "local", "host": "client", "name": "Local workspace", "type": "localStorage"}]
    for source in collection.find(filter={"documentType": document_type}, projection=["host", "name", "type"]):
        source["id"] = str(source["_id"])
        source.pop("_id")
        all_sources.append(source)
    return all_sources


def data_source_post(id):
    document = request.get_json()
    validate_mongo_data_source(document)
    document["_id"] = id
    try:
        result = collection.insert_one(document)
        return str(result.inserted_id)
    except DuplicateKeyError:
        return abort(400, message=f"Error: A data-source with name {id} already exists")
    except Exception as error:
        return abort(500, message=f"Error: Something went wrong. {error}")


def data_source_put(id):
    document = request.get_json()
    validate_mongo_data_source(document)
    result = collection.replace_one({"_id": id}, document, upsert=True)
    return str(result.acknowledged)


def data_source_delete(id):
    result = collection.delete_one(filter={"_id": id})
    return result.acknowledged


class DataSource(Resource):
    @staticmethod
    def post(id):
        return data_source_post(id)

    @staticmethod
    def put(id):
        return data_source_put(id)

    @staticmethod
    def delete(id):
        return data_source_delete(id)

    @staticmethod
    def get():
        document_type = request.args["documentType"]
        return data_sources_get(document_type)

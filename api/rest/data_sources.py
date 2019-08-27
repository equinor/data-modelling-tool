from flask import request
from flask_restful import Resource

from services.database import data_modelling_tool_db as database
from utils.logging import logger
from config import Config

collection = database[f'{Config.DATA_SOURCES_COLLECTION}']


def data_sources_get():
    all_sources = []
    for source in collection.find(projection=['host', 'name', 'type']):
        source['_id'] = str(source['_id'])
        all_sources.append(source)
    return all_sources


def data_source_post():
    document = request.get_json()
    logger.info(f"Inserting new data-source named {document['name']}.")
    result = collection.insert_one(document)
    logger.info(f'Successfully inserted with id {result}')
    return str(result.inserted_id)


def data_source_put(_id):
    document = request.get_json()
    result = collection.replace_one({'_id': _id}, document, upsert=True)
    return str(result.acknowledged)


def data_source_delete(_id):
    result = collection.delete_one(filter={'_id': _id})
    return result.acknowledged


class SingleDataSource(Resource):
    @staticmethod
    def put(_id):
        return data_source_put(_id=_id)

    @staticmethod
    def delete(_id):
        return data_source_delete(_id=_id)


class DataSources(Resource):
    @staticmethod
    def get():
        return data_sources_get()

    @staticmethod
    def post():
        return data_source_post()

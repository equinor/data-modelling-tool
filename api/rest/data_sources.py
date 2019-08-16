from flask import request
from flask_restful import Resource

from services.database import data_modelling_tool_db as database
from utils.logging import logger

collection_suffix = 'data_sources'


def data_sources_get():
    data_sources = database.data_sources

    all_sources = []
    for source in data_sources.find(projection=['host', 'name', 'type']):
        source['_id'] = str(source['_id'])
        all_sources.append(source)
    return all_sources


def data_source_post():
    document = request.get_json()
    logger.info(f"Inserting new data-source named {document['name']}.")
    result = database.data_sources.insert_one(document)
    logger.info(f'Successfully inserted with id {result}')
    return str(result.inserted_id)


def data_source_put(_id):
    document = request.get_json()
    result = database.data_sources.replace_one({'_id': _id}, document, upsert=True)
    return str(result.acknowledged)


class SingleDataSource(Resource):
    @staticmethod
    def put(_id):
        return data_source_put(_id=_id)


class DataSources(Resource):
    @staticmethod
    def get():
        return data_sources_get()

    @staticmethod
    def post():
        return data_source_post()

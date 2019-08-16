from flask import request
from flask_restful import Resource

from config import Config
from services.database import data_modelling_tool_db
from utils.logging import logger

collection_suffix = 'data_sources'


def data_sources_get(collection):
    data_sources = data_modelling_tool_db[collection]

    all_sources = []
    for source in data_sources.find(projection=['host', 'name', 'type']):
        source['_id'] = str(source['_id'])
        all_sources.append(source)
    return all_sources


def data_source_post(collection):
    document = request.get_json()
    logger.info(f"Inserting new data-source named {document['name']}.")
    result = data_modelling_tool_db[collection].insert_one(document)
    logger.info(f'Successfully inserted with id {result}')
    return str(result.inserted_id)


def data_source_put(collection, _id):
    document = request.get_json()
    result = data_modelling_tool_db[collection].replace_one({'_id': _id}, document, upsert=True)
    return str(result.acknowledged)


class SingleBlueprintDataSource(Resource):
    @staticmethod
    def put(_id):
        return data_source_put(_id=_id, collection=Config.BLUEPRINT_DATA_SOURCE_COLLECTION)


class SingleEntityDataSource(Resource):
    @staticmethod
    def put(_id):
        return data_source_put(_id=_id, collection=Config.BLUEPRINT_DATA_SOURCE_COLLECTION)


class BlueprintDataSources(Resource):
    @staticmethod
    def get():
        return data_sources_get(collection=Config.BLUEPRINT_DATA_SOURCE_COLLECTION)

    @staticmethod
    def post():
        return data_source_post(collection=Config.BLUEPRINT_DATA_SOURCE_COLLECTION)


class EntityDataSources(Resource):
    @staticmethod
    def get():
        return data_sources_get(form_type=Config.ENTITY_DATA_SOURCE_COLLECTION)

    @staticmethod
    def post():
        return data_source_post(collection=Config.ENTITY_DATA_SOURCE_COLLECTION)

from flask import request
from flask_restful import Resource, abort

from services.database import data_modelling_tool_db
from utils.logging import logger

collection = 'data_sources'


class DataSources(Resource):
    @staticmethod
    def get():
        data_sources = data_modelling_tool_db[f'{collection}']

        all_sources = []
        for source in data_sources.find(projection=['host', 'name']):
            source['_id'] = str(source['_id'])
            all_sources.append(source)
        return all_sources

    @staticmethod
    def post():
        document = request.get_json()
        try:
            logger.info(f"Inserting new data-source named {document['name']}.")
            result = data_modelling_tool_db[f'{collection}'].insert_one(document)
            _id = str(result.inserted_id)
        except Exception as e:
            abort(500, message=f"Something went wrong: {e}")

        logger.info(f'Inserted with id {_id}')
        return _id

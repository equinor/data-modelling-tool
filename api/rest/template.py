from flask import request
from flask_restful import Resource, abort

from config import Config
from services.database import data_modelling_tool_db


class Template(Resource):
    @staticmethod
    def get(_id):
        result = data_modelling_tool_db[Config.TEMPLATES_COLLECTION].find_one(filter={'_id': _id})
        if not result:
            return abort(404)
        else:
            return result

    @staticmethod
    def put(_id):
        form = request.get_json()
        if _id:
            form['_id'] = _id
        try:
            result = data_modelling_tool_db[Config.TEMPLATES_COLLECTION].replace_one({'_id': _id}, form, upsert=True)
            return result.acknowledged
        except Exception as error:
            return abort(500, error)

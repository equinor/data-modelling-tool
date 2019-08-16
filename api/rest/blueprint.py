from flask import request
from flask_restful import Resource

from .common import common_get, common_put
from classes.data_source import DataSource


# New
class DSBlueprint(Resource):
    @staticmethod
    def get(data_source_id, blueprint_id):
        data_source = DataSource(_id=data_source_id)
        return data_source.client.read_form(_id=blueprint_id)

    @staticmethod
    def post(data_source_id, blueprint_id):
        form = request.get_json()
        data_source = DataSource(_id=data_source_id)
        result = data_source.client.create_form(form=form, _id=blueprint_id)
        return str(result.inserted_id)

    @staticmethod
    def put(data_source_id, blueprint_id):
        form = request.get_json()
        data_source = DataSource(_id=data_source_id)
        result = data_source.client.update_form(form=form, _id=blueprint_id)
        return result.acknowledged


# Old
class Blueprint(Resource):
    @staticmethod
    def get(path):
        return common_get('blueprints', path)

    @staticmethod
    def put(path):
        return common_put('blueprints', path)

from flask import request
from flask_restful import Resource

from .common import common_get, common_put
from .utility_functions.data_source import get_data_source, get_data_source_client
from .utility_functions.queries import find_form, write_form, update_form


# New
class DSBlueprint(Resource):
    @staticmethod
    def get(data_source_id, blueprint_id):
        data_source = get_data_source(_id=data_source_id, form_type='blueprint')
        client = get_data_source_client(data_source=data_source)

        document = find_form(client=client, data_source=data_source, _id=blueprint_id)
        return document

    @staticmethod
    def post(data_source_id, blueprint_id):
        form = request.get_json()
        data_source = get_data_source(_id=data_source_id, form_type='blueprint')
        client = get_data_source_client(data_source=data_source)
        result = write_form(client=client, data_source=data_source, form=form, _id=blueprint_id)
        return str(result.inserted_id)

    @staticmethod
    def put(data_source_id, blueprint_id):
        form = request.get_json()
        data_source = get_data_source(_id=data_source_id, form_type='blueprint')
        client = get_data_source_client(data_source=data_source)
        result = update_form(client=client, data_source=data_source, form=form, _id=blueprint_id)
        return result.acknowledged


# Old
class Blueprint(Resource):
    @staticmethod
    def get(path):
        return common_get('blueprints', path)

    @staticmethod
    def put(path):
        return common_put('blueprints', path)

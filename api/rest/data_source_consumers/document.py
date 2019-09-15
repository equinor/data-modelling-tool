from flask import request
from flask_restful import Resource

from classes.data_source import DataSource


class Document(Resource):
    @staticmethod
    def get(data_source_id, form_id):
        data_source = DataSource(_id=data_source_id)
        return data_source.client.read_form(_id=form_id)

    @staticmethod
    def post(data_source_id, form_id):
        form = request.get_json()
        data_source = DataSource(_id=data_source_id)
        inserted_id = data_source.client.create_form(form=form, _id=form_id)
        return str(inserted_id)

    @staticmethod
    def put(data_source_id, form_id):
        form = request.get_json()
        data_source = DataSource(_id=data_source_id)
        return data_source.client.update_form(form=form, _id=form_id)

    @staticmethod
    def delete(data_source_id, form_id):
        data_source = DataSource(_id=data_source_id)
        return data_source.client.delete_form(_id=form_id)

from flask import request
from flask_restful import Resource

from classes.data_source import DataSource
from utils.schema_tools.form_to_schema import form_to_schema


class DocumentToSchema(Resource):
    @staticmethod
    def get(data_source_id, form_id):
        data_source = DataSource(_id=data_source_id)
        return form_to_schema(data_source.client.read_form(_id=form_id))

from flask import request
from flask_restful import Resource

from utils.schema_tools.form_to_schema import form_to_schema


class FormToSchema(Resource):
    @staticmethod
    def post():
        form = request.get_json()

        return form_to_schema(form)

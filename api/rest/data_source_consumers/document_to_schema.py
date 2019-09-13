from flask_restful import Resource

from classes.data_source import DataSource
from utils.schema_tools.form_to_schema import form_to_schema


class DocumentToSchema(Resource):
    @staticmethod
    def get(data_source_id, form_id):
        data_source = DataSource(id=data_source_id)
        form = data_source.client.read_form(_id=form_id)
        form["formData"] = form_to_schema(form["formData"])
        return form

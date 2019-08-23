from flask_restful import Api

from rest.form import Blueprint, Form
from rest.blueprint_to_json_schema import BlueprintToJsonSchema
from rest.data_sources import DataSources, SingleDataSource
from rest.entity import Entity
from rest.transformer import Transformer
from rest.index import Index
from rest.template import Template
from rest.form_to_schema import FormToSchema


def create_api(app):
    api = Api(app)
    api.add_resource(Transformer, '/api/transformer/json-schema')
    api.add_resource(Index, '/api/index/<string:data_source_id>')

    api.add_resource(SingleDataSource, '/api/data-sources/<string:_id>')
    api.add_resource(DataSources, '/api/data-sources')

    api.add_resource(Form, '/api/data-sources/<string:data_source_id>/<path:form_id>')
    api.add_resource(FormToSchema, '/api/data-sources/<string:data_source_id>/<path:form_id>/json-schema')

    api.add_resource(Template, '/api/templates/<path:_id>')

    # TODO: Legacy... Remove related code
    api.add_resource(Blueprint, '/api/blueprints/<path:path>')
    api.add_resource(BlueprintToJsonSchema, '/api/blueprints/<path:path>/json-schema')
    api.add_resource(Entity, '/api/entities/<path:path>')
    return app

from flask_restful import Api

from rest.blueprint import Blueprint
from rest.blueprint_to_json_schema import BlueprintToJsonSchema
from rest.entity import Entity
from rest.template import Template
from rest.index import Index
from rest.data_sources import DataSources


def create_api(app):
    api = Api(app)
    api.add_resource(DataSources, '/api/data-sources')

    # TODO: Legacy...
    api.add_resource(Template, '/api/templates/<path:path>')
    api.add_resource(Blueprint, '/api/blueprints/<path:path>')
    api.add_resource(BlueprintToJsonSchema, '/api/blueprints/<path:path>/json-schema')
    api.add_resource(Entity, '/api/entities/<path:path>')
    api.add_resource(Index, '/api/index/<string:schema_type>')
    return app

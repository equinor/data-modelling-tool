from flask_restful import Api

from rest.blueprint import Blueprint, DSBlueprint
from rest.blueprint_to_json_schema import BlueprintToJsonSchema
from rest.data_sources import DataSources, SingleDataSource
from rest.entity import Entity
from rest.form_to_schema import FormToSchema
from rest.index import Index
from rest.template import Template


def create_api(app):
    api = Api(app)
    api.add_resource(FormToSchema, '/api/transformer/json-schema')

    api.add_resource(SingleDataSource, '/api/data-sources/<string:_id>')
    api.add_resource(DataSources, '/api/data-sources')
    # TODO: Path or Id?
    api.add_resource(DSBlueprint, '/api/data-sources/<string:data_source_id>/blueprints/<path:blueprint_id>')

    # TODO: Legacy... Remove related code
    api.add_resource(Template, '/api/templates/<path:path>')
    api.add_resource(Blueprint, '/api/blueprints/<path:path>')
    api.add_resource(BlueprintToJsonSchema, '/api/blueprints/<path:path>/json-schema')
    api.add_resource(Entity, '/api/entities/<path:path>')
    api.add_resource(Index, '/api/index/<string:schema_type>')
    return app

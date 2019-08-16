from flask_restful import Api

from rest.blueprint import Blueprint, DSBlueprint
from rest.blueprint_to_json_schema import BlueprintToJsonSchema
from rest.data_sources import EntityDataSources, BlueprintDataSources, SingleBlueprintDataSource, SingleEntityDataSource
from rest.entity import Entity
from rest.index import Index
from rest.template import Template


def create_api(app):
    api = Api(app)
    api.add_resource(SingleEntityDataSource, '/api/data-sources/entities/<string:_id>')
    api.add_resource(SingleBlueprintDataSource, '/api/data-sources/blueprints/<string:_id>')
    api.add_resource(BlueprintDataSources, '/api/data-sources/blueprints')
    api.add_resource(EntityDataSources, '/api/data-sources/entities')
    # TODO: Path or Id?
    api.add_resource(DSBlueprint, '/api/data-sources/<string:data_source_id>/blueprints/<path:blueprint_id>')

    # TODO: Legacy...
    api.add_resource(Template, '/api/templates/<path:path>')
    api.add_resource(Blueprint, '/api/blueprints/<path:path>')
    api.add_resource(BlueprintToJsonSchema, '/api/blueprints/<path:path>/json-schema')
    api.add_resource(Entity, '/api/entities/<path:path>')
    api.add_resource(Index, '/api/index/<string:schema_type>')
    return app

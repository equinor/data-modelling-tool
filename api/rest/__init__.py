from flask_restful import Api

from rest.blueprint import Blueprint
from rest.entity import Entity
from rest.entity_root_packages import EntityRootPackages
from rest.template import Template
from rest.index import Index


def create_api(app):
    api = Api(app)
    api.add_resource(Template, '/api/templates/<path:path>')
    api.add_resource(Blueprint, '/api/blueprints/<path:path>')
    api.add_resource(Entity, '/api/entities/<path:path>')
    api.add_resource(EntityRootPackages, '/api/entities-root-packages/<path:path>')
    api.add_resource(Index, '/api/index/<string:schema_type>')
    return app

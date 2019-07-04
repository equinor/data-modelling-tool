from flask_restful import Api

from rest.schema import Schema


def create_api(app):
    api = Api(app)
    api.add_resource(Schema, '/api/<path:path>')
    return app

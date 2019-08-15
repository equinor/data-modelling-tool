from flask_restful import Resource

from .common import common_get, common_put


class Blueprint(Resource):
    @staticmethod
    def get(path):
        return common_get('blueprints', path)

    @staticmethod
    def put(path):
        return common_put('blueprints', path)

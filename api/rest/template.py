from flask_restful import Resource

from .common import common_get, common_put


class Template(Resource):
    @staticmethod
    def get(path):
        return common_get('templates', path)

    @staticmethod
    def put(path):
        common_put('templates', path)

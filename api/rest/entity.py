from flask import jsonify, request, abort
from flask_restful import Resource

from services.database import model_db
from .common import common_put, common_get


class Entity(Resource):
    @staticmethod
    def get(path):
        return common_get('entities', path)

    @staticmethod
    def put(path):
        return common_put('entities', path)

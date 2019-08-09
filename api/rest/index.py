from flask import jsonify, abort
from flask_restful import Resource

from services.database import db

VALID_TYPES = ('templates', 'blueprints', 'entities')


class Index(Resource):
    @staticmethod
    def get(schema_type):
        if schema_type not in VALID_TYPES:
            return abort(500, f'Error: Valid index types are {VALID_TYPES}')
        documents = []
        for document in db[f'{schema_type}'].find({}, {'title': '1', 'name': '2', 'version': '3'}):
            documents.append(document)
        return jsonify(documents)

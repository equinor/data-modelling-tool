from flask import jsonify, abort
from flask_restful import Resource

from services.database import db

VALID_TYPES = ('templates', 'blueprints', 'entities', 'entities_root_packages')


class Index(Resource):
    @staticmethod
    def get(schema_type):
        if schema_type not in VALID_TYPES:
            return abort(500, f'Error: Valid index types are {VALID_TYPES}')
        documents = []
        return_keys = {'title', '1'}
        if schema_type == 'entities_root_packages':
            return_keys = {'name', '1'}
        for document in db[f'{schema_type}'].find({}, return_keys):
            documents.append(document)
        return jsonify(documents)

from flask import jsonify, abort
from flask_restful import Resource

from services.database import model_db

VALID_TYPES = ('templates', 'blueprints', 'entities')


class Index(Resource):
    @staticmethod
    def get(schema_type):
        if schema_type not in VALID_TYPES:
            return abort(500, f'Error: Valid index types are {VALID_TYPES}')
        documents = []
        for document in model_db[f'{schema_type}'].find(filter={}, projection=['title', 'name', 'version']):

            # generate root packages. example: /schemas/blueprint/propellers/1.0.0/package.json
            # a parent will be generated if it does not exist.
            # {
            #   '_id': propellers/package.json
            #   'title': 'root
            # }
            _id = document['_id']
            if 'version' in document:
                version = document['version']
                if 'package.json' in _id:
                    parentId = _id.replace('/'+version, '')
                    if not any(document['_id'] == parentId for document in documents):
                        documents.append({
                            '_id': parentId,
                            'title': parentId.replace('/package.json', '')
                        })

            documents.append(document)
        return jsonify(documents)

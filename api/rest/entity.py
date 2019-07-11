from flask import jsonify, request, abort
from flask_restful import Resource

from services.database import db


class Entity(Resource):
    @staticmethod
    def get(path):
        document = db.template.find_one({"_id": path})
        if not document:
            return abort(404)
        return jsonify(document)

    @staticmethod
    def put(path):
        data = request.get_json()
        data['_id'] = path
        try:
            db.template.replace_one({'_id': path}, data, upsert=True)
            return path
        except Exception as e:
            abort(500, f"Something went wrong: {e}")

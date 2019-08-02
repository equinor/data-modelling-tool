from flask import jsonify, request, abort
from flask_restful import Resource

from services.database import db


class EntityRootPackages(Resource):
    @staticmethod
    def get(path):
        document = db.entities_root_packages.find_one({"_id": path})
        if not document:
            return abort(404)
        return jsonify(document)

    @staticmethod
    def put(path):
        data = request.get_json()
        data['_id'] = path
        try:
            db.entities_root_packages.replace_one({'_id': path}, data, upsert=True)
            return path
        except Exception as e:
            abort(500, f"Something went wrong: {e}")

from flask import jsonify, request, abort
from flask_restful import Resource

from services.database import db



class BlueprintToJsonSchema(Resource):
    @staticmethod
    def get(path):
        document = db.blueprints.find_one({"_id": path})
        if not document:
            return abort(404)
        properties = {}
        for attribute in document['attributes']:
            if attribute["attributeType"] == "Array/Matrix":
                properties[attribute["name"]] = {
                    "type": "array",
                    "items": {
                        "type": attribute["type"]
                    }
                }
            if attribute["attributeType"] == "Single":
                properties[attribute["name"]] = {
                    "type": attribute["type"]
                }
        return jsonify({
            "properties": properties
        })



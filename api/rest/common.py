from flask import jsonify, request, abort

from services.database import model_db


def common_get(collection, path):
    document = model_db[f'{collection}'].find_one({"_id": path})
    if not document:
        return abort(404)
    return jsonify(document)


def common_put(collection, path):
    data = request.get_json()
    data['_id'] = path
    try:
        model_db[f'{collection}'].replace_one({'_id': path}, data, upsert=True)
        return path
    except Exception as e:
        abort(500, f"Something went wrong: {e}")

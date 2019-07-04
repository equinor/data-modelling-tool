from rest import bp
import json
from flask import jsonify


@bp.route('/<path:path>', methods=['GET'])
def api(path):
    with open(f'/code/models/{path}') as json_file:
        return jsonify(json.load(json_file))

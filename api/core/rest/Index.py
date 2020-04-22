import json

from core.use_case.generate_index_use_case import GenerateIndexUseCase as GenerateIndexUseCase
from flask import Blueprint, Response

blueprint = Blueprint("index", __name__)


@blueprint.route("/api/v4/index/<string:data_source_id>", methods=["GET"])
def get(data_source_id: str):
    use_case = GenerateIndexUseCase()
    result = use_case.execute(data_source_id=data_source_id)
    return Response(json.dumps(result), mimetype="application/json", status=200)


@blueprint.route("/api/v4/index/<string:data_source_id>/<string:parent_id>/<string:document_id>", methods=["GET"])
def get_single_index(data_source_id: str, parent_id: str, document_id: str):
    use_case = GenerateIndexUseCase()
    result = use_case.single(data_source_id=data_source_id, document_id=document_id, parent_id=parent_id,)

    return Response(json.dumps(result), mimetype="application/json", status=200)

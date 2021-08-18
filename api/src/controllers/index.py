import json

from flask import Blueprint, request, Response

from enums import STATUS_CODES
from use_case.generate_index_use_case import (
    GenerateIndexRequestObject,
    GenerateIndexUseCase as GenerateIndexUseCase,
    GenerateSingleIndexRequestObject,
    GenerateSingleIndexUseCase,
)

blueprint = Blueprint("index", __name__)

# Auth is handled by DMSS


@blueprint.route("/api/v4/index/<string:data_source_id>", methods=["GET"])
def get(data_source_id: str):
    use_case = GenerateIndexUseCase()
    result = use_case.execute(GenerateIndexRequestObject(data_source_id, request.args.get("APPLICATION")))
    return Response(json.dumps(result.value), mimetype="application/json", status=STATUS_CODES[result.type])


@blueprint.route("/api/v4/index/<string:data_source_id>/<string:parent_id>/<string:document_id>", methods=["GET"])
def get_single_index(data_source_id: str, parent_id: str, document_id: str):
    use_case = GenerateSingleIndexUseCase()
    application = request.args.get("APPLICATION")
    result = use_case.execute(GenerateSingleIndexRequestObject(data_source_id, application, document_id, parent_id))

    return Response(json.dumps(result.value), mimetype="application/json", status=STATUS_CODES[result.type])

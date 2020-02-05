import json

from core.repository.repository_factory import get_repository
from core.use_case.generate_index_use_case import GenerateIndexUseCase as GenerateIndexUseCase
from flask import Blueprint, Response

blueprint = Blueprint("index", __name__)


@blueprint.route("/api/v4/index/<string:data_source_id>", methods=["GET"])
def get_v2(data_source_id: str):
    document_repository = get_repository(data_source_id)
    use_case = GenerateIndexUseCase()
    result = use_case.execute(data_source_id=data_source_id, application_page=document_repository.document_type,)
    return Response(json.dumps(result), mimetype="application/json", status=200)


@blueprint.route("/api/v4/index/<string:data_source_id>/<string:parent_id>/<string:document_id>", methods=["GET"])
def get_single_index_v2(data_source_id: str, parent_id: str, document_id: str):
    document_repository = get_repository(data_source_id)

    use_case = GenerateIndexUseCase()
    result = use_case.single(
        data_source_id=data_source_id,
        document_id=document_id,
        application_page=document_repository.document_type,
        parent_id=parent_id,
    )

    return Response(json.dumps(result), mimetype="application/json", status=200)

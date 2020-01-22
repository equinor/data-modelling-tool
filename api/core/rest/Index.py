import json

from flask import Blueprint, Response

from classes.data_source import DataSource
from core.repository.repository_factory import get_repository
from core.use_case.generate_index_use_case_v2 import GenerateIndexUseCase as GenerateIndexUseCase2

blueprint = Blueprint("index", __name__)


@blueprint.route("/api/v4/index/<string:data_source_id>", methods=["GET"])
def get_v2(data_source_id: str):
    data_source = DataSource(uid=data_source_id)
    repository = get_repository(data_source)
    use_case = GenerateIndexUseCase2()
    result = use_case.execute(
        data_source_id=data_source_id, repository=repository, application_page=data_source.documentType
    )
    return Response(json.dumps(result), mimetype="application/json", status=200)


@blueprint.route("/api/v4/index/<string:data_source_id>/<string:parent_id>/<string:document_id>", methods=["GET"])
def get_single_index_v2(data_source_id: str, parent_id: str, document_id: str):
    data_source = DataSource(uid=data_source_id)
    repository = get_repository(data_source)

    use_case = GenerateIndexUseCase2()
    result = use_case.single(
        repository=repository, document_id=document_id, application_page=data_source.documentType, parent_id=parent_id
    )

    return Response(json.dumps(result), mimetype="application/json", status=200)

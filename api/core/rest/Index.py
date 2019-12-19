import json

from flask import Blueprint, Response

from classes.data_source import DataSource
from core.repository.repository_factory import get_repository
from core.use_case.generate_index_use_case import GenerateIndexUseCase

blueprint = Blueprint("index", __name__)


@blueprint.route("/api/v3/index/<string:data_source_id>", methods=["GET"])
def get(data_source_id: str):
    data_source = DataSource(id=data_source_id)
    document_repository = get_repository(data_source)
    use_case = GenerateIndexUseCase(document_repository=document_repository,)
    result = use_case.execute(
        data_source_id=data_source_id, document_type=data_source.documentType, data_source_name=data_source.name
    )
    return Response(json.dumps(result.to_dict()), mimetype="application/json", status=200)


@blueprint.route("/api/v3/index/<string:data_source_id>/<string:document_id>", methods=["GET"])
def get_document(data_source_id: str, document_id: str):
    data_source = DataSource(id=data_source_id)
    document_repository = get_repository(data_source)

    use_case = GenerateIndexUseCase(document_repository)
    result = use_case.single(
        data_source_id=data_source_id,
        data_source_name=data_source.name,
        document_id=document_id,
        document_type=data_source.documentType,
    )

    return Response(json.dumps(result), mimetype="application/json", status=200)


@blueprint.route(
    "/api/v3/index/<string:data_source_id>/attribute/<string:attribute>/<string:document_id>", methods=["GET"]
)
def get_attribute(data_source_id: str, attribute: str, document_id: str):
    data_source = DataSource(id=data_source_id)
    document_repository = get_repository(data_source)

    use_case = GenerateIndexUseCase(document_repository=document_repository,)
    result = use_case.single(
        data_source_id=data_source_id,
        data_source_name=data_source.name,
        document_id=document_id,
        document_type=data_source.documentType,
        attribute=attribute,
    )

    return Response(json.dumps(result), mimetype="application/json", status=200)

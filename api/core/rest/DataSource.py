import json

from flask import Blueprint, request, Response

from core.serializers.create_data_source_serializer import CreateDataSourceSerializer
from core.serializers.get_data_sources_serializer import GetDataSourcesSerializer
from core.service.document_service import DocumentService
from services.data_modelling_document_service import datasource_api

blueprint = Blueprint("datasource", __name__)

document_service = DocumentService()


@blueprint.route("/api/v2/data-sources", methods=["GET"])
def get_all_data_sources_by_document_type() -> Response:
    return Response(
        json.dumps(datasource_api.get_all(), cls=GetDataSourcesSerializer), mimetype="application/json", status=200,
    )


@blueprint.route("/api/v2/data-sources/<string:data_source_id>", methods=["POST"])
def create_data_source(data_source_id: str) -> Response:
    data_source = datasource_api.save(data_source_id, request_body=request.get_json())
    return Response(
        json.dumps(data_source.to_dict(), cls=CreateDataSourceSerializer), mimetype="application/json", status=200,
    )

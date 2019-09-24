import json

from flask import Blueprint, request, Response

from core.rest.Explorer import STATUS_CODES
from core.serializers.create_data_source_serializer import CreateDataSourceSerializer
from core.serializers.get_data_sources_serializer import GetDataSourcesSerializer
from core.use_case.create_data_source_use_case import CreateDataSourceUseCase, CreateDataSourceRequestObject
from core.use_case.get_data_sources_use_case import GetDataSourcesUseCase, GetDataSourcesUseCaseRequestObject

blueprint = Blueprint("datasource", __name__)


@blueprint.route("/api/v2/data-sources", methods=["GET"])
def get_all_data_sources_by_document_type() -> Response:
    use_case = GetDataSourcesUseCase()
    request_object = GetDataSourcesUseCaseRequestObject.from_dict(request.args)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=GetDataSourcesSerializer),
        mimetype="application/json",
        status=STATUS_CODES[response.type],
    )


@blueprint.route("/api/v2/data-sources/<string:data_source_id>", methods=["POST"])
def create_data_source(data_source_id: str) -> Response:
    use_case = CreateDataSourceUseCase()
    request_object = CreateDataSourceRequestObject.from_dict(
        {"dataSourceId": data_source_id, "formData": request.get_json()}
    )
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=CreateDataSourceSerializer),
        mimetype="application/json",
        status=STATUS_CODES[response.type],
    )

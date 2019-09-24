import json

from flask import Blueprint, request, Response

from core.rest.Explorer import STATUS_CODES
from core.serializers.get_data_sources_serializer import GetDataSourcesSerializer
from core.use_case.get_data_sources_use_case import GetDataSourcesUseCase, GetDataSourcesUseCaseRequestObject

blueprint = Blueprint("datasource", __name__)


# @blueprint.route("/api/v2/data-sources/<string:data_source_id>", methods=["POST", "PUT", "DELTE"])
# @blueprint.route("/api/v2/data-sources", methods=["GET"])
# def post(data_source_id: str):
#     use_case = CreateIndexUseCase()
#     result = use_case.execute(data_source_id=data_source_id, data_source_name=db.name)
#     return Response(json.dumps(result.to_dict()), mimetype="application/json", status=200)


@blueprint.route("/api/v2/data-sources", methods=["GET"])
def get_all_data_sources_by_document_type():
    use_case = GetDataSourcesUseCase()
    request_object = GetDataSourcesUseCaseRequestObject.from_dict(request.args)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=GetDataSourcesSerializer),
        mimetype="application/json",
        status=STATUS_CODES[response.type],
    )

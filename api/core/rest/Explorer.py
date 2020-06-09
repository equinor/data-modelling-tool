import json

from flask import Blueprint, request, Response, send_file

from core.enums import STATUS_CODES
from core.rest.utils.dmss_api_wrapper import dmss_api_wrapper
from core.serializers.dto_json_serializer import DTOSerializer
from core.service.document_service import explorer_api, get_cached_document
from core.shared import response_object as res
from core.use_case.export_use_case import ExportRequestObject, ExportUseCase
from core.use_case.move_file_use_case import MoveFileRequestObject, MoveFileUseCase
from services.data_modelling_document_service import search_api

blueprint = Blueprint("explorer", __name__)


@blueprint.route("/api/v2/explorer/move-file", methods=["PUT"])
def move_file():
    request_data = request.get_json()
    use_case = MoveFileUseCase()
    request_object = MoveFileRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)
    get_cached_document.cache_clear()
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type]
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/export/<string:document_id>", methods=["GET"])
def export(data_source_id: str, document_id: str):
    request_object = ExportRequestObject.from_dict({"data_source_id": data_source_id, "documentId": document_id})
    use_case = ExportUseCase(data_source_id=data_source_id)
    response = use_case.execute(request_object)

    if response.type == res.ResponseSuccess.SUCCESS:
        return send_file(
            response.value, mimetype="application/zip", as_attachment=True, attachment_filename=f"{document_id}.zip"
        )
    else:
        return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])

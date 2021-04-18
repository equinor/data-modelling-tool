import json

from flask import Blueprint, Response, send_file

from enums import STATUS_CODES
from restful import response_object as res
from use_case.export_use_case import ExportRequestObject, ExportUseCase

blueprint = Blueprint("explorer", __name__)


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

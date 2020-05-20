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


@blueprint.route("/api/v2/explorer/<string:data_source_id>/add-file", methods=["POST"])
def add_file(data_source_id: str):
    @dmss_api_wrapper
    def dmss_call():
        request_data = request.get_json()
        return explorer_api.add_to_parent(
            data_source_id,
            {
                "parentId": request_data.get("parentId"),
                "type": request_data.get("type"),
                "name": request_data.get("name"),
                "description": request_data.get("description"),
                "attribute": request_data.get("attribute"),
            },
            _preload_content=False,
        )

    get_cached_document.cache_clear()
    return dmss_call()


@blueprint.route("/api/search/<string:data_source_id>", methods=["POST"])
def search_entities(data_source_id: str):
    @dmss_api_wrapper
    def dmss_call():
        return search_api.search_entities(data_source_id, request.get_json())

    return dmss_call()


# Add file by directory path
@blueprint.route("/api/v1/explorer/<string:data_source_id>/add-document", methods=["POST"])
def add_document(data_source_id: str):
    @dmss_api_wrapper
    def dmss_call():
        request_data = request.get_json()
        return explorer_api.add_to_path(
            data_source_id, {"document": request_data.get("document"), "directory": request_data.get("directory")}
        )

    get_cached_document.cache_clear()
    return dmss_call()


@blueprint.route("/api/v4/explorer/<string:data_source_id>/remove", methods=["POST"])
def remove(data_source_id: str):
    @dmss_api_wrapper
    def dmss_call():
        request_data = request.get_json()
        return explorer_api.remove(
            data_source_id, {"documentId": request_data.get("documentId"), "parentId": request_data.get("parentId")}
        )

    get_cached_document.cache_clear()
    return dmss_call()


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


@blueprint.route("/api/v2/explorer/<string:data_source_id>/add-root-package", methods=["POST"])
def add_root_package(data_source_id: str):
    @dmss_api_wrapper
    def dmss_call():
        request_data = request.get_json()
        return explorer_api.add_package(data_source_id, request_data)

    return dmss_call()


@blueprint.route("/api/v2/explorer/<string:data_source_id>/rename", methods=["PUT"])
def rename(data_source_id: str):
    @dmss_api_wrapper
    def dmss_call():
        request_data = request.get_json()
        return explorer_api.rename(
            data_source_id,
            {
                "documentId": request_data.get("documentId"),
                "parentId": request_data.get("parentId"),
                "name": request_data.get("name"),
                "description": request_data.get("description"),
            },
        )

    get_cached_document.cache_clear()
    return dmss_call()


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

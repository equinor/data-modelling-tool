import json

from flask import Blueprint, request, Response, send_file

from core.repository.repository_factory import get_repository
from core.serializers.dto_json_serializer import DTOSerializer
from core.shared import response_object as res
from core.use_case.add_file_use_case import AddFileRequestObject, AddFileUseCase
from core.use_case.add_root_package_use_case import AddRootPackageRequestObject, AddRootPackageUseCase
from core.use_case.export_use_case import ExportRequestObject, ExportUseCase
from core.use_case.move_file_use_case import MoveFileRequestObject, MoveFileUseCase
from core.use_case.remove_use_case import RemoveFileRequestObject, RemoveUseCase
from core.use_case.rename_file_use_case import RenameRequestObject, RenameUseCase

blueprint = Blueprint("explorer", __name__)

STATUS_CODES = {
    res.ResponseSuccess.SUCCESS: 200,
    res.ResponseFailure.RESOURCE_ERROR: 404,
    res.ResponseFailure.PARAMETERS_ERROR: 400,
    res.ResponseFailure.SYSTEM_ERROR: 500,
}


@blueprint.route("/api/v2/explorer/<string:data_source_id>/add-file", methods=["POST"])
def add_file(data_source_id: str):
    request_data = request.get_json()
    request_data["data_source_id"] = data_source_id
    use_case = AddFileUseCase()
    request_object = AddFileRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type]
    )


@blueprint.route("/api/v4/explorer/<string:data_source_id>/remove", methods=["POST"])
def remove(data_source_id: str):
    request_data = request.get_json()
    request_data["data_source_id"] = data_source_id
    use_case = RemoveUseCase()
    request_object = RemoveFileRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type]
    )


@blueprint.route("/api/v2/explorer/move-file", methods=["PUT"])
def move_file():
    request_data = request.get_json()
    use_case = MoveFileUseCase(get_repository=get_repository)
    request_object = MoveFileRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type]
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/add-root-package", methods=["POST"])
def add_root_package(data_source_id: str):
    request_data = request.get_json()
    document_repository = get_repository(data_source_id)
    use_case = AddRootPackageUseCase(document_repository=document_repository)
    request_object = AddRootPackageRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)

    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type]
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/rename", methods=["PUT"])
def rename(data_source_id: str):
    request_data = request.get_json()
    request_data["data_source_id"] = data_source_id
    use_case = RenameUseCase()
    request_object = RenameRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type]
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/export/<string:document_id>", methods=["GET"])
def post(data_source_id: str, document_id: str):
    request_object = ExportRequestObject.from_dict({"data_source_id": data_source_id, "documentId": document_id})
    use_case = ExportUseCase()
    response = use_case.execute(request_object)

    if response.type == res.ResponseSuccess.SUCCESS:
        return send_file(
            response.value, mimetype="application/zip", as_attachment=True, attachment_filename=f"{document_id}.zip"
        )
    else:
        return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])

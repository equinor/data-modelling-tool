import json
from flask import Blueprint, Response, request, send_file
from classes.data_source import DataSource
from core.repository.repository_factory import get_repository
from core.serializers.dto_json_serializer import DTOSerializer
from core.use_case.add_file_use_case import AddFileUseCase, AddFileRequestObject
from core.shared import response_object as res
from core.use_case.add_root_package_use_case import AddRootPackageUseCase, AddRootPackageRequestObject
from core.use_case.export_use_case import ExportUseCase, ExportRequestObject
from core.use_case.remove_attribute_use_case import RemoveAttributeUseCase, RemoveAttributeRequestObject
from core.use_case.remove_file_use_case import RemoveFileUseCase, RemoveFileRequestObject
from core.use_case.move_file_use_case import MoveFileUseCase, MoveFileRequestObject
from core.use_case.remove_use_case import RemoveUseCase_v2, RemoveFileRequestObject_v2
from core.use_case.rename_attribute_use_case import RenameAttributeUseCase, RenameAttributeRequestObject
from core.use_case.rename_file_use_case import RenameFileUseCase, RenameFileRequestObject

blueprint = Blueprint("explorer", __name__)

STATUS_CODES = {
    res.ResponseSuccess.SUCCESS: 200,
    res.ResponseFailure.RESOURCE_ERROR: 404,
    res.ResponseFailure.PARAMETERS_ERROR: 400,
    res.ResponseFailure.SYSTEM_ERROR: 500,
}


@blueprint.route("/api/v2/explorer/<string:data_source_id>/add-file", methods=["POST"])
def add_file(data_source_id: str):
    data_source = DataSource(uid=data_source_id)
    request_data = request.get_json()
    document_repository = get_repository(data_source)
    use_case = AddFileUseCase(document_repository=document_repository)
    request_object = AddFileRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type]
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/remove-file", methods=["POST"])
def remove_file(data_source_id: str):
    db = DataSource(uid=data_source_id)
    request_data = request.get_json()
    document_repository = get_repository(db)
    use_case = RemoveFileUseCase(document_repository=document_repository)
    request_object = RemoveFileRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type],
    )


@blueprint.route("/api/v4/explorer/<string:data_source_id>/remove", methods=["POST"])
def remove(data_source_id: str):
    db = DataSource(uid=data_source_id)
    request_data = request.get_json()
    document_repository = get_repository(db)
    use_case = RemoveUseCase_v2(document_repository=document_repository)
    request_object = RemoveFileRequestObject_v2.from_dict(request_data)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type],
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/remove-attribute", methods=["POST"])
def remove_attribute(data_source_id: str):
    db = DataSource(uid=data_source_id)
    request_data = request.get_json()
    document_repository = get_repository(db)
    use_case = RemoveAttributeUseCase(document_repository=document_repository)
    request_object = RemoveAttributeRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type],
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/rename-attribute", methods=["PUT"])
def rename_attribute(data_source_id: str):
    db = DataSource(uid=data_source_id)
    request_data = request.get_json()
    document_repository = get_repository(db)
    use_case = RenameAttributeUseCase(document_repository=document_repository)
    request_object = RenameAttributeRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type],
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
    db = DataSource(uid=data_source_id)
    request_data = request.get_json()

    document_repository = get_repository(db)

    use_case = AddRootPackageUseCase(document_repository=document_repository)
    request_object = AddRootPackageRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)

    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type]
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/rename-file", methods=["PUT"])
def rename_file(data_source_id: str):
    db = DataSource(uid=data_source_id)
    request_data = request.get_json()
    document_repository = get_repository(db)
    use_case = RenameFileUseCase(document_repository=document_repository)
    request_object = RenameFileRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type],
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/export/<string:document_id>", methods=["GET"])
def post(data_source_id: str, document_id: str):
    data_source = DataSource(uid=data_source_id)
    document_repository = get_repository(data_source)
    request_object = ExportRequestObject.from_dict({"documentId": document_id})
    use_case = ExportUseCase(document_repository)
    response = use_case.execute(request_object)

    if response.type == res.ResponseSuccess.SUCCESS:
        return send_file(
            response.value, mimetype="application/zip", as_attachment=True, attachment_filename=f"{document_id}.zip"
        )
    else:
        return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])

import json
from flask import Blueprint, Response, request
from classes.data_source import DataSource
from core.serializers.add_file_json_serializer import AddFileSerializer
from core.repository.repository_factory import get_repository
from core.enums import RepositoryType
from core.serializers.dto_json_serializer import DTOSerializer
from core.use_case.add_entity_file_to_package_use_case import (
    AddEntityFileToPackageUseCase,
    AddEntityFileToPackageRequestObject,
)
from core.use_case.add_file_use_case import AddFileUseCase, AddFileRequestObject
from core.shared import response_object as res
from core.use_case.add_root_package_use_case import AddRootPackageUseCase, AddRootPackageRequestObject
from core.use_case.remove_file_use_case import RemoveFileUseCase, RemoveFileRequestObject
from core.use_case.move_file_use_case import MoveFileUseCase, MoveFileRequestObject

blueprint = Blueprint("explorer", __name__)

STATUS_CODES = {
    res.ResponseSuccess.SUCCESS: 200,
    res.ResponseFailure.RESOURCE_ERROR: 404,
    res.ResponseFailure.PARAMETERS_ERROR: 400,
    res.ResponseFailure.SYSTEM_ERROR: 500,
}


@blueprint.route("/api/v2/explorer/<string:data_source_id>/add-file", methods=["POST"])
def add_file(data_source_id: str):
    data_source = DataSource(id=data_source_id)
    request_data = request.get_json()
    document_repository = get_repository(RepositoryType.DocumentRepository, data_source)
    use_case = AddFileUseCase(
        document_repository=document_repository, get_repository=get_repository, data_source=data_source
    )
    request_object = AddFileRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type]
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/add-entity-file", methods=["POST"])
def add_entity_file_to_package(data_source_id: str):
    data_source = DataSource(id=data_source_id)
    request_data = request.get_json(force=True)
    document_repository = get_repository(RepositoryType.DocumentRepository, data_source)
    package_repository = get_repository(RepositoryType.PackageRepository, data_source)
    use_case = AddEntityFileToPackageUseCase(
        document_repository=document_repository, package_repository=package_repository
    )
    request_data["type"] = request_data["data"]["type"]
    request_object = AddEntityFileToPackageRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type]
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/remove-file", methods=["POST"])
def remove_file(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()
    document_repository = get_repository(RepositoryType.DocumentRepository, db)
    use_case = RemoveFileUseCase(document_repository=document_repository)
    request_object = RemoveFileRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=AddFileSerializer),
        mimetype="application/json",
        status=STATUS_CODES[response.type],
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
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    document_repository = get_repository(RepositoryType.DocumentRepository, db)

    use_case = AddRootPackageUseCase(document_repository=document_repository)
    request_object = AddRootPackageRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)

    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type]
    )

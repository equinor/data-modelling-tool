import json
from flask import Blueprint, Response, request
from classes.data_source import DataSource
from core.serializers.add_file_json_serializer import AddFileSerializer
from core.repository.repository_factory import get_repository, RepositoryType
from core.use_case.add_file_to_package_use_case import AddFileToPackageUseCase, AddFileToPackageRequestObject
from core.use_case.add_package_to_package_use_case import AddPackageToPackageUseCase, AddPackageToPackageRequestObject
from core.shared import response_object as res
from core.use_case.add_root_package_use_case import AddRootPackageUseCase, AddRootPackageRequestObject
from core.use_case.remove_file_from_package_use_case import (
    RemoveFileFromPackageUseCase,
    RemoveFileFromPackageRequestObject,
)
from core.use_case.remove_package_from_package_use_case import (
    RemovePackageFromPackageUseCase,
    RemovePackageFromPackageRequestObject,
)
from core.use_case.move_file_use_case import MoveFileUseCase, MoveFileRequestObject
from core.use_case.move_package_use_case import MovePackageUseCase, MovePackageRequestObject
from core.use_case.remove_root_package_use_case import RemoveRootPackageRequestObject, RemoveRootPackageUseCase
from core.use_case.move_root_package_use_case import MoveRootPackageRequestObject, MoveRootPackageUseCase

blueprint = Blueprint("explorer", __name__)

STATUS_CODES = {
    res.ResponseSuccess.SUCCESS: 200,
    res.ResponseFailure.RESOURCE_ERROR: 404,
    res.ResponseFailure.PARAMETERS_ERROR: 400,
    res.ResponseFailure.SYSTEM_ERROR: 500,
}


@blueprint.route("/api/v2/explorer/<string:data_source_id>/add-file", methods=["POST"])
def add_file_to_package(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    document_repository = get_repository(RepositoryType.DocumentRepository, db)
    sub_package_repository = get_repository(RepositoryType.SubPackageRepository, db)

    use_case = AddFileToPackageUseCase(
        document_repository=document_repository, sub_package_repository=sub_package_repository
    )

    request_object = AddFileToPackageRequestObject.from_dict(request_data)

    response = use_case.execute(request_object)

    return Response(
        json.dumps(response.value, cls=AddFileSerializer),
        mimetype="application/json",
        status=STATUS_CODES[response.type],
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/remove-file", methods=["POST"])
def remove_file_from_package(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    document_repository = get_repository(RepositoryType.DocumentRepository, db)
    sub_package_repository = get_repository(RepositoryType.SubPackageRepository, db)

    use_case = RemoveFileFromPackageUseCase(
        document_repository=document_repository, sub_package_repository=sub_package_repository
    )

    request_object = RemoveFileFromPackageRequestObject.from_dict(request_data)

    response = use_case.execute(request_object)

    return Response(
        json.dumps(response.value, cls=AddFileSerializer),
        mimetype="application/json",
        status=STATUS_CODES[response.type],
    )


@blueprint.route("/api/v2/explorer/move-file", methods=["POST"])
def move_file():
    request_data = request.get_json()

    use_case = MoveFileUseCase(get_repository=get_repository)

    request_object = MoveFileRequestObject.from_dict(request_data)

    response = use_case.execute(request_object)

    return Response(
        json.dumps(response.value, cls=AddFileSerializer),
        mimetype="application/json",
        status=STATUS_CODES[response.type],
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/add-package", methods=["POST"])
def add_package_to_package(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    sub_package_repository = get_repository(RepositoryType.SubPackageRepository, db)

    use_case = AddPackageToPackageUseCase(sub_package_repository=sub_package_repository)

    request_object = AddPackageToPackageRequestObject.from_dict(request_data)

    response = use_case.execute(request_object)

    return Response(
        json.dumps(response.value, cls=AddFileSerializer),
        mimetype="application/json",
        status=STATUS_CODES[response.type],
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/remove-package", methods=["POST"])
def remove_package_from_package(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    document_repository = get_repository(RepositoryType.DocumentRepository, db)
    sub_package_repository = get_repository(RepositoryType.SubPackageRepository, db)

    use_case = RemovePackageFromPackageUseCase(
        document_repository=document_repository, sub_package_repository=sub_package_repository
    )

    request_object = RemovePackageFromPackageRequestObject.from_dict(request_data)

    response = use_case.execute(request_object)

    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])


@blueprint.route("/api/v2/explorer/move-package", methods=["POST"])
def move_package():
    request_data = request.get_json()

    use_case = MovePackageUseCase(get_repository=get_repository)

    request_object = MovePackageRequestObject.from_dict(request_data)

    response = use_case.execute(request_object)

    return Response(
        json.dumps(response.value, cls=AddFileSerializer),
        mimetype="application/json",
        status=STATUS_CODES[response.type],
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/add-root-package", methods=["POST"])
def add_root_package(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    root_package_repository = get_repository(RepositoryType.RootPackageRepository, db)
    sub_package_repository = get_repository(RepositoryType.SubPackageRepository, db)

    use_case = AddRootPackageUseCase(
        sub_package_repository=sub_package_repository, root_package_repository=root_package_repository
    )

    request_object = AddRootPackageRequestObject.from_dict(request_data)

    response = use_case.execute(request_object)

    return Response(
        json.dumps(response.value, cls=AddFileSerializer),
        mimetype="application/json",
        status=STATUS_CODES[response.type],
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/remove-root-package", methods=["POST"])
def remove_root_package(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    root_package_repository = get_repository(RepositoryType.RootPackageRepository, db)
    document_repository = get_repository(RepositoryType.DocumentRepository, db)
    sub_package_repository = get_repository(RepositoryType.SubPackageRepository, db)

    use_case = RemoveRootPackageUseCase(
        document_repository=document_repository,
        root_package_repository=root_package_repository,
        sub_package_repository=sub_package_repository,
    )

    request_object = RemoveRootPackageRequestObject.from_dict(request_data)

    response = use_case.execute(request_object)

    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])


@blueprint.route("/api/v2/explorer/move-root-package", methods=["POST"])
def move_root_package():
    request_data = request.get_json()

    use_case = MoveRootPackageUseCase(get_repository=get_repository)

    request_object = MoveRootPackageRequestObject.from_dict(request_data)

    response = use_case.execute(request_object)

    return Response(
        json.dumps(response.value, cls=AddFileSerializer),
        mimetype="application/json",
        status=STATUS_CODES[response.type],
    )

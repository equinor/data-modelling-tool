import json
from flask import Blueprint, Response, request
from classes.data_source import DataSource
from core.domain.blueprint import Blueprint as Document
from core.serializers.add_file_json_serializer import AddFileSerializer
from core.repository.repository_factory import get_repository
from utils.enums import RepositoryType
from core.use_case.add_entity_file_to_package_use_case import (
    AddEntityFileToPackageUseCase,
    AddEntityFileToPackageRequestObject,
)
from core.use_case.add_file_use_case import AddFileUseCase, AddFileRequestObject
from core.use_case.add_package_use_case import AddPackageUseCase, AddPackageRequestObject
from core.shared import response_object as res
from core.use_case.add_root_package_use_case import AddRootPackageUseCase, AddRootPackageRequestObject
from core.use_case.generate_index_use_case import GenerateIndexUseCase
from core.use_case.remove_file_use_case import RemoveFileUseCase, RemoveFileRequestObject
from core.use_case.remove_package_use_case import RemovePackageUseCase, RemovePackageRequestObject
from core.use_case.move_file_use_case import MoveFileUseCase, MoveFileRequestObject
from core.use_case.move_package_use_case import MovePackageUseCase, MovePackageRequestObject

blueprint = Blueprint("explorer", __name__)

STATUS_CODES = {
    res.ResponseSuccess.SUCCESS: 200,
    res.ResponseFailure.RESOURCE_ERROR: 404,
    res.ResponseFailure.PARAMETERS_ERROR: 400,
    res.ResponseFailure.SYSTEM_ERROR: 500,
}


@blueprint.route("/api/v2/explorer/<string:data_source_id>/add-file", methods=["POST"])
def add_file(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    document_repository = get_repository(RepositoryType.DocumentRepository, db)
    package_repository = get_repository(RepositoryType.PackageRepository, db)

    use_case = AddFileUseCase(document_repository=document_repository, get_repository=get_repository, data_source=db)
    request_object = AddFileRequestObject.from_dict(request_data)
    response = use_case.execute(request_object)

    use_case = GenerateIndexUseCase(
        blueprint_repository=document_repository,
        package_repository=package_repository,
        get_repository=get_repository,
        document_repository=document_repository,
    )

    # TODO: Replace this
    data = response.value.data
    result = use_case.single(
        data_source_id=data_source_id,
        data_source_name=db.name,
        document=Document(uid=response.value.uid, description="", name=data["name"], type=data["type"]),
    )

    return Response(json.dumps(result), mimetype="application/json", status=STATUS_CODES[response.type])


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

    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])


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

    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])


@blueprint.route("/api/v2/explorer/<string:data_source_id>/add-package", methods=["POST"])
def add_package(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    document_repository = get_repository(RepositoryType.DocumentRepository, db)

    use_case = AddPackageUseCase(document_repository=document_repository)

    request_object = AddPackageRequestObject.from_dict(request_data)

    response = use_case.execute(request_object)

    return Response(
        json.dumps(response.value, cls=AddFileSerializer),
        mimetype="application/json",
        status=STATUS_CODES[response.type],
    )


@blueprint.route("/api/v2/explorer/<string:data_source_id>/remove-package", methods=["POST"])
def remove_package(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    document_repository = get_repository(RepositoryType.DocumentRepository, db)

    use_case = RemovePackageUseCase(document_repository=document_repository)

    request_object = RemovePackageRequestObject.from_dict(request_data)

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


# Keep root-package functions add,remove and move, since we may later need special logic for this root folder type


@blueprint.route("/api/v2/explorer/<string:data_source_id>/add-root-package", methods=["POST"])
def add_root_package(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    document_repository = get_repository(RepositoryType.DocumentRepository, db)
    package_repository = get_repository(RepositoryType.PackageRepository, db)

    use_case = AddRootPackageUseCase(document_repository=document_repository)
    request_object = AddRootPackageRequestObject.from_dict(request_data)
    root_package = use_case.execute(request_object)

    use_case = GenerateIndexUseCase(
        blueprint_repository=document_repository,
        package_repository=package_repository,
        get_repository=get_repository,
        document_repository=document_repository,
    )
    result = use_case.single(data_source_id=data_source_id, data_source_name=db.name, document=root_package.value)

    return Response(json.dumps(result), mimetype="application/json", status=200)  # STATUS_CODES[response.type],


@blueprint.route("/api/v2/explorer/<string:data_source_id>/remove-root-package", methods=["POST"])
def remove_root_package(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    document_repository = get_repository(RepositoryType.DocumentRepository, db)

    use_case = RemovePackageUseCase(document_repository=document_repository)

    request_object = RemovePackageRequestObject.from_dict(request_data)

    response = use_case.execute(request_object)

    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])


@blueprint.route("/api/v2/explorer/move-root-package", methods=["POST"])
def move_root_package():
    request_data = request.get_json()

    use_case = MovePackageUseCase(get_repository=get_repository)

    request_object = MovePackageRequestObject.from_dict(request_data)

    response = use_case.execute(request_object)

    return Response(
        json.dumps(response.value, cls=AddFileSerializer),
        mimetype="application/json",
        status=STATUS_CODES[response.type],
    )

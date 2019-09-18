import json
from flask import Blueprint, Response, request
from classes.data_source import DataSource
from core.serializers.document_json_serializer import DocumentSerializer
from core.repository.repository_factory import get_repository, RepositoryType
from core.use_case.add_file_to_package_use_case import AddFileToPackageUseCase, AddFileToPackageRequestObject
from core.use_case.add_package_to_package_use_case import AddPackageToPackageUseCase
from core.domain.package import SubPackage
from core.shared import response_object as res

blueprint = Blueprint("explorer", __name__)

STATUS_CODES = {
    res.ResponseSuccess.SUCCESS: 200,
    res.ResponseFailure.RESOURCE_ERROR: 404,
    res.ResponseFailure.PARAMETERS_ERROR: 400,
    res.ResponseFailure.SYSTEM_ERROR: 500,
}


@blueprint.route("/api/explorer/<string:data_source_id>/add-file", methods=["POST"])
def add_file_to_package(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    document_repository = get_repository(RepositoryType.DocumentRepository, db)
    package_repository = get_repository(RepositoryType.PackageRepository, db)

    use_case = AddFileToPackageUseCase(document_repository=document_repository, package_repository=package_repository)

    request_object = AddFileToPackageRequestObject.from_dict(request_data)

    response = use_case.execute(request_object)

    return Response(
        json.dumps(response.value.to_dict(), cls=DocumentSerializer),
        mimetype="application/json",
        status=STATUS_CODES[response.type],
    )


@blueprint.route("/api/explorer/<string:data_source_id>/add-package", methods=["POST"])
def add_package_to_package(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    package_repository = get_repository(RepositoryType.PackageRepository, db)

    use_case = AddPackageToPackageUseCase(package_repository=package_repository)

    sub_package = SubPackage().from_dict(request_data["document"])
    added_sub_package = use_case.execute(request_data["parentId"], sub_package)

    return Response(json.dumps(added_sub_package.to_dict(), cls=DocumentSerializer), mimetype="application/json")

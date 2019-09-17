import json
from flask import Blueprint, Response, request
from classes.data_source import DataSource
from core.serializers.document_json_serializer import DocumentSerializer
from core.repository.repository_factory import get_repository, RepositoryType
from core.use_case.add_file_to_package_use_case import AddFileToPackageUseCase
from core.use_case.add_package_to_package_use_case import AddPackageToPackageUseCase
from core.domain.document import Document
from core.domain.package import SubPackage

blueprint = Blueprint("explorer", __name__)


@blueprint.route("/api/explorer/<string:data_source_id>/add-file-to-package", methods=["POST"])
def add_file_to_package(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    document_repository = get_repository(RepositoryType.DocumentRepository, db)
    package_repository = get_repository(RepositoryType.PackageRepository, db)

    use_case = AddFileToPackageUseCase(document_repository=document_repository, package_repository=package_repository)

    document = Document.from_dict(request_data["document"])
    added_document = use_case.execute(request_data["package_id"], document)

    return Response(
        json.dumps(added_document.to_dict(), cls=DocumentSerializer), mimetype="application/json", status=200
    )


@blueprint.route("/api/explorer/<string:data_source_id>/add-package-to-package", methods=["POST"])
def add_package_to_package(data_source_id: str):
    db = DataSource(id=data_source_id)
    request_data = request.get_json()

    package_repository = get_repository(RepositoryType.PackageRepository, db)

    use_case = AddPackageToPackageUseCase(package_repository=package_repository)

    sub_package = SubPackage().from_dict(request_data["document"])
    added_sub_package = use_case.execute(request_data["package_id"], sub_package)

    return Response(
        json.dumps(added_sub_package.to_dict(), cls=DocumentSerializer), mimetype="application/json", status=200
    )

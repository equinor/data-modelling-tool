import json
from flask import Blueprint, Response
from classes.data_source import DataSource
from core.repository.repository_factory import get_repository, RepositoryType
from core.use_case.create_index_use_case import CreateIndexUseCase
from core.use_case.generate_index_use_case import GenerateIndexUseCase

blueprint = Blueprint("index", __name__)


@blueprint.route("/api/v2/index/<string:data_source_id>", methods=["GET"])
def get(data_source_id: str):
    db = DataSource(id=data_source_id)
    root_package_repository = get_repository(RepositoryType.RootPackageRepository, db)
    package_repository = get_repository(RepositoryType.SubPackageRepository, db)
    document_repository = get_repository(RepositoryType.DocumentRepository, db)

    use_case = CreateIndexUseCase(
        root_package_repository=root_package_repository,
        package_repository=package_repository,
        document_repository=document_repository,
    )
    result = use_case.execute(data_source_id=data_source_id, data_source_name=db.name)
    return Response(json.dumps(result.to_dict()), mimetype="application/json", status=200)


@blueprint.route("/api/v3/index/<string:data_source_id>", methods=["GET"])
def get_v2(data_source_id: str):
    db = DataSource(id=data_source_id)
    document_repository = get_repository(RepositoryType.DocumentRepository, db)

    use_case = GenerateIndexUseCase(document_repository=document_repository)
    result = use_case.execute(data_source_id=data_source_id, data_source_name=db.name)
    return Response(json.dumps(result.to_dict()), mimetype="application/json", status=200)

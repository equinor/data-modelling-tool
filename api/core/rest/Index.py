import json
from flask import Blueprint, Response
from classes.data_source import DataSource
from core.repository.repository_factory import get_repository
from utils.enums import RepositoryType
from core.use_case.generate_index_use_case import GenerateIndexUseCase

blueprint = Blueprint("index", __name__)


@blueprint.route("/api/v3/index/<string:data_source_id>", methods=["GET"])
def get(data_source_id: str):
    data_source = DataSource(id=data_source_id)
    blueprint_repository = get_repository(RepositoryType.BlueprintRepository, data_source)
    package_repository = get_repository(RepositoryType.PackageRepository, data_source)

    use_case = GenerateIndexUseCase(
        blueprint_repository=blueprint_repository, package_repository=package_repository, get_repository=get_repository
    )
    result = use_case.execute(data_source_id=data_source_id, data_source_name=data_source.name)
    return Response(json.dumps(result.to_dict()), mimetype="application/json", status=200)

import json
from flask import Blueprint, Response
from classes.data_source import DataSource
from core.repository.repository_factory import get_repository, RepositoryType
from core.use_case.generate_index_use_case import GenerateIndexUseCase

blueprint = Blueprint("index", __name__)


@blueprint.route("/api/v3/index/<string:data_source_id>", methods=["GET"])
def get(data_source_id: str):
    db = DataSource(id=data_source_id)
    blueprint_repository = get_repository(RepositoryType.BlueprintRepository, db)

    use_case = GenerateIndexUseCase(blueprint_repository=blueprint_repository, get_repository=get_repository)
    result = use_case.execute(data_source_id=data_source_id, data_source_name=db.name)
    return Response(json.dumps(result.to_dict()), mimetype="application/json", status=200)

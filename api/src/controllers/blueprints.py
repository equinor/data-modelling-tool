import json

from flask import Blueprint, Response

from enums import STATUS_CODES
from use_case.get_related_blueprints_use_case import GetRelatedBlueprintsRequestObject, GetRelatedBlueprintsUseCase
from utils.logging import logger

blueprint = Blueprint("blueprints", __name__)


@blueprint.route("/api/blueprints/<path:target>", methods=["GET"])
def get(target: str):
    logger.info(f"Getting blueprints used by '{target}'")
    use_case = GetRelatedBlueprintsUseCase()
    request_object = GetRelatedBlueprintsRequestObject(blueprint=target)
    response = use_case.execute(request_object)
    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])

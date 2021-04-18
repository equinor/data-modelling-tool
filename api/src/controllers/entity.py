import json

from flask import Blueprint, request, Response

from enums import STATUS_CODES
from use_case.instantiate_entity import InstantiateEntityUseCase
from utils.logging import logger

blueprint = Blueprint("entities", __name__)


@blueprint.route("/api/entity", methods=["POST"])
def instantiate():
    request_data = request.get_json()
    try:
        name = request_data["name"]
        type = request_data["type"]
    except [KeyError, TypeError]:
        msg = "Invalid request for 'instantiate entity'. 'name' or 'type' missing from request"
        logger.error(msg)
        raise Exception(msg)

    logger.info(f"Creating entity for type '{type}'")
    use_case = InstantiateEntityUseCase()
    response = use_case.execute({"name": name, "type": type})
    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])

import json

from flask import Blueprint, request, Response

from core.shared import response_object as res
from core.use_case.create_entity import CreateEntityUseCase
from core.use_case.get_blueprints_use_case import GetBlueprintsRequestObject, GetBlueprintsUseCase
from utils.logging import logger

blueprint = Blueprint("entities", __name__)

STATUS_CODES = {
    res.ResponseSuccess.SUCCESS: 200,
    res.ResponseFailure.RESOURCE_ERROR: 404,
    res.ResponseFailure.PARAMETERS_ERROR: 400,
    res.ResponseFailure.SYSTEM_ERROR: 500,
}


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
    use_case = CreateEntityUseCase()
    response = use_case.execute({"name": name, "type": type})
    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])

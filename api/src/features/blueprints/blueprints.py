from fastapi import APIRouter
from starlette.responses import JSONResponse

from features.blueprints.use_cases.get_related_blueprints_use_case import (
    get_related_blueprints_use_case,
)
from restful.responses import create_response, responses
from utils.logging import logger

router = APIRouter(tags=["DMT", "Blueprints"], prefix="/blueprints")


# TODO seems like this is not used anymore
@router.get("/{target:path}", operation_id="get_blueprints", responses=responses)
@create_response(JSONResponse)
def get(target: str):
    logger.info(f"Getting blueprints used by '{target}'")
    return get_related_blueprints_use_case(target_blueprint=target)

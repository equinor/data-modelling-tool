from fastapi import APIRouter
from use_case.blueprints.get_related_blueprints_use_case import get_related_blueprints_use_case
from restful.responses import create_response
from utils.logging import logger
from starlette.responses import JSONResponse

router = APIRouter(tags=["Blueprints"], prefix="/blueprints")


# TODO seems like this is not used anymore
@router.get("/{target:path}", operation_id="get_blueprints")
@create_response(JSONResponse)
def get(target: str):
    logger.info(f"Getting blueprints used by '{target}'")
    return get_related_blueprints_use_case(target_blueprint=target)

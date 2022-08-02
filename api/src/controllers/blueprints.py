from fastapi import APIRouter
from use_case.blueprints.get_related_blueprints_use_case import (
    GetRelatedBlueprintsRequestObject,
    GetRelatedBlueprintsUseCase,
)
from utils.logging import logger

router = APIRouter(tags=["Blueprints"], prefix="/blueprints")


# TODO seems like this is not used anymore
@router.get("/{target:path}", operation_id="get_blueprints")
def get(target: str):
    logger.info(f"Getting blueprints used by '{target}'")
    use_case = GetRelatedBlueprintsUseCase()
    request_object = GetRelatedBlueprintsRequestObject(blueprint=target)
    return use_case.execute(request_object)

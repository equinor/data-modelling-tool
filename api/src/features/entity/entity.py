from fastapi import APIRouter
from starlette.responses import JSONResponse

from features.entity.use_cases.instantiate_entity import (
    BasicEntity,
    instantiate_entity_use_case,
)
from restful.responses import create_response, responses

router = APIRouter(tags=["DMT", "Entities"], prefix="/entity")


@router.post("", operation_id="instantiate_entity", responses=responses)
@create_response(JSONResponse)
def instantiate(entity: BasicEntity):
    return instantiate_entity_use_case(basic_entity=entity)

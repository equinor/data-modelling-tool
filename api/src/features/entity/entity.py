from fastapi import APIRouter
from features.entity.use_cases.instantiate_entity import instantiate_entity_use_case
from features.entity.use_cases.instantiate_entity import BasicEntity
from restful.responses import create_response
from starlette.responses import JSONResponse

router = APIRouter(tags=["Entities"], prefix="/entity")


@router.post("", operation_id="instantiate_entity")
@create_response(JSONResponse)
def instantiate(entity: BasicEntity):
    return instantiate_entity_use_case(basic_entity=entity)

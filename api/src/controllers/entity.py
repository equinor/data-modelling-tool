from fastapi import APIRouter
from use_case.entity.instantiate_entity import InstantiateEntityUseCase
from use_case.entity.instantiate_entity import BasicEntity

router = APIRouter(tags=["Entities"], prefix="/entity")


@router.post("", operation_id="instantiate_entity")
def instantiate(entity: BasicEntity):
    use_case = InstantiateEntityUseCase()
    return use_case.execute(entity)

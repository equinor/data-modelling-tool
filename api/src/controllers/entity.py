from fastapi import APIRouter
from use_case.instantiate_entity import InstantiateEntityUseCase
from use_case.instantiate_entity import BasicEntity

router = APIRouter(tags=["Entities"], prefix="/entity")

# Auth is handled by DMSS


@router.post("", operation_id="instantiate_entity")
def instantiate(entity: BasicEntity):
    use_case = InstantiateEntityUseCase()
    return use_case.execute(entity)

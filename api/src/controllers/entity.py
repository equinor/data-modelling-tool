import json
from fastapi import APIRouter
from flask import request
from use_case.instantiate_entity import InstantiateEntityUseCase
from utils.logging import logger

router = APIRouter(tags=["Entities"], prefix="/entity")

# Auth is handled by DMSS

@router.post("/", operation_id="entity")
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
    return use_case.execute({"name": name, "type": type})
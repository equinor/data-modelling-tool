import json

from fastapi import APIRouter, Request
from starlette import status
from starlette.responses import JSONResponse, PlainTextResponse

from features.system.use_cases.create_application_use_case import (
    create_application_use_case,
)
from features.system.use_cases.get_application_settings_use_case import (
    get_application_settings_use_case,
)
from features.system.use_cases.set_application_settings_use_case import (
    set_application_settings_use_case,
)
from restful.responses import create_response, responses
from utils.logging import logger

router = APIRouter(tags=["DMT", "System"], prefix="/system")

# This is a public endpoint with no authentication. So don't put secrets in settings.json


@router.get("/settings", operation_id="get_app_settings", responses=responses)
@create_response(JSONResponse)
def get_application_settings(application_name: str = ""):
    return get_application_settings_use_case(application_name=application_name)


# Endpoint is only available on ENVIRONMENT=local


@router.post("/settings", operation_id="set_app_settings", responses=responses)
@create_response(PlainTextResponse)
def set_application_settings(request: Request):
    return set_application_settings_use_case(request=request)


# TODO seems like this is not used anymore
@router.get("/{data_source_id}/create-application/{application_id}", operation_id="create_app", responses=responses)
@create_response(JSONResponse)
def create_application(data_source_id: str, application_id: str):
    logger.info(f"Creating application in data source '{data_source_id}' from application settings '{application_id}'")
    return create_application_use_case(data_source_id=data_source_id, application_id=application_id)


# TODO seems like this is not used anymore
@router.get(
    "/{data_source_id}/generate-code/{plugin_name}/{document_path}", operation_id="generate_code", responses=responses
)
def generate_code_with_plugin(data_source_id: str, plugin_name: str, document_path: str):
    return JSONResponse(
        json.dumps("Error: This feature has been deprecated"),
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )

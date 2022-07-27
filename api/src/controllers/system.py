import json

import markupsafe
import requests

from fastapi import APIRouter, Request
from config import config
from enums import STATUS_CODES
from restful import response_object as res
from use_case.create_application_use_case import CreateApplicationRequestObject, CreateApplicationUseCase
from utils.logging import logger
from starlette.responses import JSONResponse, PlainTextResponse
from fastapi.responses import StreamingResponse

router = APIRouter(tags=["System"], prefix="/system")


# This is a public endpoint with no authentication. So don't put secrets in settings.json

@router.get("/settings", operation_id="get_app_settings")
def get_application_settings(request: Request):
    app_name = ""
    try:
        app_name = request.query_params["APPLICATION"] #todo check if this works...
    except:
        logger.info("no app name found")
    if app_name:
        if app_name in config.APP_SETTINGS:  # Return settings for the specific application
            return JSONResponse(
                config.APP_SETTINGS.get(app_name),
                status_code=STATUS_CODES[res.ResponseSuccess.SUCCESS],
            )
        else:
            return PlainTextResponse(
                f"Error: No application named '{markupsafe.escape(app_name)}' is loaded",
                status_code=404,
            )
    return JSONResponse(
        config.APP_SETTINGS,
        status_code=200,
    )


# Endpoint is only available on ENVIRONMENT=local

@router.post("/settings", operation_id="set_app_settings")
def set_application_settings(request: Request):
    app_name = request.query_params("APPLICATION")
    if config.ENVIRONMENT != "local":
        return PlainTextResponse("Changing systems settings can only be done in local deployments.", status=403)
    try:
        with open(config.APP_SETTINGS.get(app_name).get("file_loc"), "w") as f:
            request_data = json.dumps(request.json)
            f.write(request_data)
        config.load_app_settings()
        return PlainTextResponse("OK", status_code=200)
    except Exception:
        return PlainTextResponse("Error: Failed to save the settings file.", status_code=500)


# Auth is handled by DMSS

@router.get("/{data_source_id}/create-application/{application_id}", operation_id="create_app")
def create_application(data_source_id: str, application_id: str):
    logger.info(f"Creating application in data source '{data_source_id}' from application settings '{application_id}'")
    request_object = CreateApplicationRequestObject.from_dict({"applicationId": application_id})
    use_case = CreateApplicationUseCase(data_source_id)
    response = use_case.execute(request_object)

    if response.type == res.ResponseSuccess.SUCCESS:
        return StreamingResponse(
            response.value, media_type="application/x-zip-compressed", filename="application.zip"
        )
    else:
        return JSONResponse(json.dumps(response.value), status_code=STATUS_CODES[response.type])


# Auth is handled by DMSS

@router.get("/{data_source_id}/generate-code/{plugin_name}/{document_path}", operation_id="generate_code")
def generate_code_with_plugin(data_source_id: str, plugin_name: str, document_path: str):
    return JSONResponse(
        json.dumps("Error: This feature has been deprecated"),
        status_code=STATUS_CODES[res.ResponseFailure.SYSTEM_ERROR],
    )
    # logger.info(f"Generating code for document {document_path}, with plugin {plugin_name}")
    # request_object = GenerateCodeWithPluginRequestObject.from_dict(
    #     {"documentPath": document_path, "pluginName": plugin_name, "dataSourceId": data_source_id}
    # )
    # use_case = GenerateCodeWithPluginUseCase()
    # response = use_case.execute(request_object)
    #
    # if response.type == res.ResponseSuccess.SUCCESS:
    #     return send_file(
    #         response.value, mimetype="application/zip", as_attachment=True, attachment_filename="generated-code.zip"
    #     )
    # else:
    #     return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])

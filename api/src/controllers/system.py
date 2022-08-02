import json

import markupsafe
from starlette import status
from fastapi import APIRouter, Request
from config import config

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
        app_name = request.query_params["APPLICATION"]
    except Exception:
        logger.info("no app name found")
    if app_name:
        if app_name in config.APP_SETTINGS:  # Return settings for the specific application
            return JSONResponse(
                config.APP_SETTINGS.get(app_name),
                status_code=status.HTTP_200_OK,
            )
        else:
            return PlainTextResponse(
                f"Error: No application named '{markupsafe.escape(app_name)}' is loaded",
                status_code=status.HTTP_404_NOT_FOUND,
            )
    return JSONResponse(
        config.APP_SETTINGS,
        status_code=status.HTTP_200_OK,
    )


# Endpoint is only available on ENVIRONMENT=local


@router.post("/settings", operation_id="set_app_settings")
def set_application_settings(request: Request):
    app_name = request.query_params("APPLICATION")
    if config.ENVIRONMENT != "local":
        return PlainTextResponse(
            "Changing systems settings can only be done in local deployments.", status=status.HTTP_403_FORBIDDEN
        )
    try:
        with open(config.APP_SETTINGS.get(app_name).get("file_loc"), "w") as f:
            request_data = json.dumps(request.json)
            f.write(request_data)
        config.load_app_settings()
        return PlainTextResponse("OK", status_code=status.HTTP_200_OK)
    except Exception:
        return PlainTextResponse(
            "Error: Failed to save the settings file.", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# TODO seems like this is not used anymore
@router.get("/{data_source_id}/create-application/{application_id}", operation_id="create_app")
def create_application(data_source_id: str, application_id: str):
    logger.info(f"Creating application in data source '{data_source_id}' from application settings '{application_id}'")
    request_object = CreateApplicationRequestObject.from_dict({"applicationId": application_id})
    use_case = CreateApplicationUseCase(data_source_id)
    response = use_case.execute(request_object)

    if response.status_code == status.HTTP_200_OK:
        return StreamingResponse(response.value, media_type="application/x-zip-compressed", filename="application.zip")
    else:
        return JSONResponse(json.dumps(response.value), status_code=response.status_code)


# TODO seems like this is not used anymore
@router.get("/{data_source_id}/generate-code/{plugin_name}/{document_path}", operation_id="generate_code")
def generate_code_with_plugin(data_source_id: str, plugin_name: str, document_path: str):
    return JSONResponse(
        json.dumps("Error: This feature has been deprecated"),
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
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

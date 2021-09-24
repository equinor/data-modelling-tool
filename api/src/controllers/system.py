import json

from flask import Blueprint, request, Response, send_file

from config import config
from enums import STATUS_CODES
from restful import response_object as res
from use_case.create_application_use_case import CreateApplicationRequestObject, CreateApplicationUseCase
from utils.logging import logger

blueprint = Blueprint("system", __name__)


# This is a public endpoint with no authentication. So don't put secrets in settings.json


@blueprint.route("/api/system/settings", methods=["GET"])
def get_application_settings():
    app_name = request.args.get("APPLICATION")
    if app_name:
        if app_name in config.APP_SETTINGS:  # Return settings for the specific application
            return Response(
                config.APP_SETTINGS.get(app_name),
                mimetype="application/json",
                status=STATUS_CODES[res.ResponseSuccess.SUCCESS],
            )
        else:
            return Response(
                f"Error: No application named '{app_name}' is loaded",
                status=404,
            )
    return Response(
        json.dumps(config.APP_SETTINGS),
        mimetype="application/json",
        status=200,
    )


# Endpoint is only available on ENVIRONMENT=local


@blueprint.route("/api/system/settings", methods=["POST"])
def set_application_settings():
    app_name = request.args.get("APPLICATION")
    if config.ENVIRONMENT != "local":
        return Response("Changing systems settings can only be done in local deployments.", status=403)
    try:
        with open(config.APP_SETTINGS.get(app_name).get("file_loc"), "w") as f:
            request_data = json.dumps(request.json)
            f.write(request_data)
        config.load_app_settings()
        return Response("OK", status=200)
    except Exception:
        return Response("Error: Failed to save the settings file.", status=500)


# Auth is handled by DMSS


@blueprint.route("/api/v2/system/<string:data_source_id>/create-application/<string:application_id>", methods=["GET"])
def create_application(data_source_id: str, application_id: str):
    logger.info(f"Creating application in data source '{data_source_id}' from application settings '{application_id}'")
    request_object = CreateApplicationRequestObject.from_dict({"applicationId": application_id})
    use_case = CreateApplicationUseCase(data_source_id)
    response = use_case.execute(request_object)

    if response.type == res.ResponseSuccess.SUCCESS:
        return send_file(
            response.value, mimetype="application/zip", as_attachment=True, attachment_filename="application.zip"
        )
    else:
        return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])


# Auth is handled by DMSS


@blueprint.route(
    "/api/system/<string:data_source_id>/generate-code/<string:plugin_name>/<path:document_path>", methods=["GET"]
)
def generate_code_with_plugin(data_source_id: str, plugin_name: str, document_path: str):
    return Response(
        json.dumps("Error: This feature has been deprecated"),
        mimetype="application/json",
        status=STATUS_CODES[res.ResponseFailure.SYSTEM_ERROR],
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

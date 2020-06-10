import json

from config import Config
from flask import Blueprint, request, Response, send_file

from core.enums import STATUS_CODES
from core.shared import response_object as res
from core.use_case.create_application_use_case import CreateApplicationRequestObject, CreateApplicationUseCase
from core.use_case.generate_code_with_plugin import GenerateCodeWithPluginRequestObject, GenerateCodeWithPluginUseCase

from utils.logging import logger

blueprint = Blueprint("system", __name__)


@blueprint.route("/api/system/settings", methods=["GET"])
def get_application_settings():
    try:
        with open(Config.ENTITY_SETTINGS_FILE) as f:
            return Response(
                json.dumps(json.load(f)), mimetype="application/json", status=STATUS_CODES[res.ResponseSuccess.SUCCESS]
            )
    except Exception as error:
        return Response(
            json.dumps("Error: Failed to load the settings file."),
            mimetype="application/json",
            status=STATUS_CODES[res.ResponseFailure.SYSTEM_ERROR],
        )


@blueprint.route("/api/system/settings", methods=["POST"])
def set_application_settings():
    if Config.ENVIRONMENT != "local":
        return Response(
            json.dumps("Changing systems settings can only be done in local deployments."),
            mimetype="application/json",
            status=403,
        )
    try:
        with open(Config.ENTITY_SETTINGS_FILE, "w") as f:
            request_data = json.dumps(request.json)
            f.write(request_data)
            Config.ENTITY_APPLICATION_SETTINGS = request.json
            return Response("OK", mimetype="application/json", status=STATUS_CODES[res.ResponseSuccess.SUCCESS])
    except Exception as error:
        return Response(
            json.dumps("Error: Failed to save the settings file."),
            mimetype="application/json",
            status=STATUS_CODES[res.ResponseFailure.SYSTEM_ERROR],
        )


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


@blueprint.route(
    "/api/system/<string:data_source_id>/generate-code/<string:plugin_name>/<path:document_path>", methods=["GET"]
)
def generate_code_with_plugin(data_source_id: str, plugin_name: str, document_path: str):
    logger.info(f"Generating code for document {document_path}, with plugin {plugin_name}")
    request_object = GenerateCodeWithPluginRequestObject.from_dict(
        {"documentPath": document_path, "pluginName": plugin_name, "dataSourceId": data_source_id}
    )
    use_case = GenerateCodeWithPluginUseCase()
    response = use_case.execute(request_object)

    if response.type == res.ResponseSuccess.SUCCESS:
        return send_file(
            response.value, mimetype="application/zip", as_attachment=True, attachment_filename="generated-code.zip"
        )
    else:
        return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])

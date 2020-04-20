import json

from flask import Blueprint, Response, send_file

from core.enums import STATUS_CODES
from core.repository.repository_factory import get_data_source
from core.shared import request_object as req
from core.shared import response_object as res
from core.use_case.create_application_use_case import CreateApplicationRequestObject, CreateApplicationUseCase
from core.use_case.generate_code_with_plugin import GenerateCodeWithPluginRequestObject, GenerateCodeWithPluginUseCase
from core.use_case.generate_python_code import GeneratePythonCodeRequestObject, GeneratePythonCodeUseCase
from core.use_case.get_application_settings_use_case import GetApplicationSettingsUseCase
from utils.logging import logger

blueprint = Blueprint("system", __name__)


@blueprint.route("/api/v2/system/<string:data_source_id>/create-application/<string:application_id>", methods=["GET"])
def post(data_source_id: str, application_id: str):
    logger.info(f"Creating application in data source '{data_source_id}' from application settings '{application_id}'")
    document_repository = get_data_source(data_source_id)
    request_object = CreateApplicationRequestObject.from_dict({"applicationId": application_id})
    use_case = CreateApplicationUseCase(document_repository)
    response = use_case.execute(request_object)

    if response.type == res.ResponseSuccess.SUCCESS:
        return send_file(
            response.value, mimetype="application/zip", as_attachment=True, attachment_filename="application.zip"
        )
    else:
        return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])


@blueprint.route("/api/v2/system/settings", methods=["GET"])
def get():
    use_case = GetApplicationSettingsUseCase()
    response = use_case.execute(req)
    if response.type == res.ResponseSuccess.SUCCESS:
        return Response(
            json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[res.ResponseSuccess.SUCCESS]
        )
    else:
        return Response(
            json.dumps("Error: Failed to load the settings file."),
            mimetype="application/json",
            status=STATUS_CODES[res.ResponseFailure.SYSTEM_ERROR],
        )


@blueprint.route("/api/v2/system/<string:data_source_id>/generate-python-code/<string:document_id>", methods=["GET"])
def generate_python_code(data_source_id: str, document_id: str):
    logger.info(f"Compiling the blueprint '{document_id}', in '{data_source_id}' to Python code")
    document_repository = get_data_source(data_source_id)
    request_object = GeneratePythonCodeRequestObject.from_dict(
        {"documentId": document_id, "dataSourceId": data_source_id}
    )
    use_case = GeneratePythonCodeUseCase(document_repository, get_data_source)
    response = use_case.execute(request_object)

    if response.type == res.ResponseSuccess.SUCCESS:
        return send_file(
            response.value, mimetype="application/zip", as_attachment=True, attachment_filename="generated-code.zip"
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

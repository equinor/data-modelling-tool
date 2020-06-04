import json

from flask import Blueprint, Response, send_file

from core.enums import STATUS_CODES
from core.shared import response_object as res
from core.use_case.create_application_use_case import CreateApplicationRequestObject, CreateApplicationUseCase
from core.use_case.generate_code_with_plugin import GenerateCodeWithPluginRequestObject, GenerateCodeWithPluginUseCase

from utils.logging import logger

blueprint = Blueprint("system", __name__)


@blueprint.route("/api/v2/system/<string:data_source_id>/create-application/<string:application_id>", methods=["GET"])
def post(data_source_id: str, application_id: str):
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

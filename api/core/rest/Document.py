import json

from flask import Blueprint, request, Response

from core.enums import STATUS_CODES
from core.rest.utils.dmss_api_wrapper import dmss_api_wrapper
from core.use_case.generate_json_schema_use_case import GenerateJsonSchemaRequestObject, GenerateJsonSchemaUseCase
from core.use_case.get_document_by_path_use_case import GetDMTDocumentByPathUseCase, GetDocumentByPathRequestObject
from core.use_case.get_document_use_case import GetDMTDocumentUseCase, GetDocumentRequestObject
from services.data_modelling_document_service import document_api
from utils.logging import logger

blueprint = Blueprint("document", __name__)


@blueprint.route("/api/v2/json-schema/<path:type>", methods=["GET"])
def get_json_schema(type: str):
    logger.info(f"Getting json-schema '{type}'")
    ui_recipe = request.args.get("ui_recipe")
    use_case = GenerateJsonSchemaUseCase()
    request_object = GenerateJsonSchemaRequestObject.from_dict({"type": type, "ui_recipe": ui_recipe})
    response = use_case.execute(request_object)
    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])


@blueprint.route("/api/v2/documents/<string:data_source_id>/<path:document_id>", methods=["GET"])
def get_by_id(data_source_id: str, document_id: str):
    logger.info(f"Getting document '{document_id}' from data source '{data_source_id}'")
    ui_recipe = request.args.get("ui_recipe")
    attribute = request.args.get("attribute")
    use_case = GetDMTDocumentUseCase()
    request_object = GetDocumentRequestObject.from_dict(
        {"data_source_id": data_source_id, "document_id": document_id, "ui_recipe": ui_recipe, "attribute": attribute}
    )
    response = use_case.execute(request_object)
    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])


@blueprint.route("/api/v2/documents_by_path/<string:data_source_id>/<path:document_path>", methods=["GET"])
def get_by_path(data_source_id: str, document_path: str):
    logger.info(f"Getting document '{document_path}' from data source '{data_source_id}'")
    ui_recipe = request.args.get("ui_recipe")
    attribute = request.args.get("attribute")
    use_case = GetDMTDocumentByPathUseCase()
    request_object = GetDocumentByPathRequestObject.from_dict(
        {"data_source_id": data_source_id, "path": document_path, "ui_recipe": ui_recipe, "attribute": attribute}
    )
    response = use_case.execute(request_object)
    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])


# TODO: This should not be needed. But since we use same URL for get Doc and put, we still do.
# Solution is to move get Doc to DMSS, or pass different URL for PUT
@blueprint.route("/api/v2/documents/<string:data_source_id>/<string:document_id>", methods=["PUT"])
def put(data_source_id: str, document_id: str):
    logger.info(f"Updating document '{document_id}' in data source '{data_source_id}'")
    data = request.get_json()
    attribute = request.args.get("attribute")

    @dmss_api_wrapper
    def dmss_call():
        return document_api.update(data_source_id, document_id, data, attribute=attribute)

    return dmss_call()

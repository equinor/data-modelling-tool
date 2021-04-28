import json

from flask import Blueprint, request, Response

from enums import STATUS_CODES
from use_case.get_document_by_path_use_case import GetDMTDocumentByPathUseCase, GetDocumentByPathRequestObject
from use_case.get_document_use_case import GetDMTDocumentUseCase, GetDocumentRequestObject
from utils.logging import logger

blueprint = Blueprint("document", __name__)


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

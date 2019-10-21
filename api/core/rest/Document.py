import json
from flask import Blueprint, Response, request
from classes.data_source import DataSource
from core.serializers.dto_json_serializer import DTOSerializer
from core.use_case.generate_json_schema_use_case import GenerateJsonSchemaUseCase, GenerateJsonSchemaRequestObject
from utils.logging import logger
from core.use_case.get_document_use_case import GetDocumentUseCase, GetDocumentRequestObject
from core.shared import response_object as res
from core.use_case.add_document_use_case import AddDocumentUseCase, AddDocumentRequestObject
from core.repository.repository_factory import get_repository, RepositoryType
from core.use_case.update_document_use_case import UpdateDocumentUseCase, UpdateDocumentRequestObject

blueprint = Blueprint("document", __name__)

STATUS_CODES = {
    res.ResponseSuccess.SUCCESS: 200,
    res.ResponseFailure.RESOURCE_ERROR: 404,
    res.ResponseFailure.PARAMETERS_ERROR: 400,
    res.ResponseFailure.SYSTEM_ERROR: 500,
}


@blueprint.route("/api/v2/json-schema/<path:type>", methods=["GET"])
def get_json_schema(type: str):
    logger.info(f"Getting json-schema '{type}'")
    ui_recipe = request.args.get("ui_recipe")
    use_case = GenerateJsonSchemaUseCase(get_repository)
    request_object = GenerateJsonSchemaRequestObject.from_dict({"type": type, "ui_recipe": ui_recipe})
    response = use_case.execute(request_object)
    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])


@blueprint.route("/api/v2/documents/<string:data_source_id>/<document_path>", methods=["GET"])
def get(data_source_id: str, document_path: str):
    logger.info(f"Getting document '{document_path}' from data source '{data_source_id}'")
    data_source = DataSource(id=data_source_id)
    document_repository = get_repository(RepositoryType.DocumentRepository, data_source)
    use_case = GetDocumentUseCase(document_repository, get_repository)
    request_object = GetDocumentRequestObject.from_dict({"document_id": document_path})
    response = use_case.execute(request_object)
    # TODO: Use DTOSerializer?
    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])


@blueprint.route("/api/v2/documents/<string:data_source_id>", methods=["POST"])
def post(data_source_id: str):
    logger.info(f"Creating document in data source '{data_source_id}'")
    data = request.get_json()
    data_source = DataSource(id=data_source_id)
    document_repository = get_repository(RepositoryType.DocumentRepository, data_source)
    request_object = AddDocumentRequestObject.from_dict({"data": data})
    use_case = AddDocumentUseCase(document_repository)
    response = use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type]
    )


@blueprint.route("/api/v2/documents/<string:data_source_id>/<string:document_id>", methods=["PUT"])
@blueprint.route("/api/v2/documents/<string:data_source_id>/<string:document_id>/<path:attribute>", methods=["PUT"])
def put(data_source_id: str, document_id: str, attribute: str = None):
    logger.info(f"Updating document '{document_id}' in data source '{data_source_id}'")
    data = request.get_json()
    data_source = DataSource(id=data_source_id)
    document_repository = get_repository(RepositoryType.DocumentRepository, data_source)
    request_object = UpdateDocumentRequestObject.from_dict(
        {"data": data, "document_id": document_id, "attribute": attribute}
    )
    update_use_case = UpdateDocumentUseCase(document_repository)
    response = update_use_case.execute(request_object)
    return Response(
        json.dumps(response.value, cls=DTOSerializer), mimetype="application/json", status=STATUS_CODES[response.type]
    )

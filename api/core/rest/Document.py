import json
from flask import Blueprint, Response, request
from classes.data_source import DataSource
from utils.logging import logger
from core.domain.document import Document
from core.use_case.get_document_with_template_use_case import GetDocumentWithTemplateUseCase

# from flask_restful import marshal
# from core.serializers.document_with_template_serializer import document_with_template_fields
from core.use_case.add_document_use_case import AddDocumentUseCase
from core.repository.repository_factory import get_repository, RepositoryType
from core.use_case.update_document_use_case import UpdateDocumentUseCase

blueprint = Blueprint("document", __name__)


@blueprint.route("/api/documents/<string:data_source_id>/<path:document_id>", methods=["GET"])
def get(data_source_id: str, document_id: str):
    logger.info(f"Getting document '{document_id}' from data source '{data_source_id}'")

    db = DataSource(id=data_source_id)

    document_repository = get_repository(RepositoryType.DocumentRepository, db)

    get_document_with_template_use_case = GetDocumentWithTemplateUseCase(document_repository)
    result = get_document_with_template_use_case.execute(document_id)

    # data = marshal(result._asdict(), document_with_template_fields)

    data = {"template": result.template.to_dict(), "document": result.document.to_dict()}

    return Response(json.dumps(data), mimetype="application/json", status=200)


@blueprint.route("/api/documents/<string:data_source_id>/<path:document_id>", methods=["POST"])
def post(data_source_id: str, document_id: str):
    logger.info(f"Creating document '{document_id}' in data source '{data_source_id}'")

    data = request.get_json()

    db = DataSource(id=data_source_id)

    document_repository = get_repository(RepositoryType.DocumentRepository, db)

    document = Document.from_dict(data)
    document.id = document_id

    add_use_case = AddDocumentUseCase(document_repository)
    add_use_case.execute(document_id, document)

    get_document_with_template_use_case = GetDocumentWithTemplateUseCase(document_repository)
    result = get_document_with_template_use_case.execute(document_id)

    # data = marshal({"template": result.template, "document": result.document.to_dict()},
    # document_with_template_fields)

    data = {"template": result.template.to_dict(), "document": result.document.to_dict()}

    return Response(json.dumps(data), mimetype="application/json", status=200)


@blueprint.route("/api/documents/<string:data_source_id>/<path:document_id>", methods=["PUT"])
def put(data_source_id: str, document_id: str):
    logger.info(f"Updating document '{document_id}' in data source '{data_source_id}'")

    data = request.get_json()

    db = DataSource(id=data_source_id)

    document_repository = get_repository(RepositoryType.DocumentRepository, db)

    add_use_case = UpdateDocumentUseCase(document_repository)
    add_use_case.execute(document_id, data)

    get_document_with_template_use_case = GetDocumentWithTemplateUseCase(document_repository)
    result = get_document_with_template_use_case.execute(document_id)

    # data = marshal({"template": result.template, "document": result.document.to_dict()},
    # document_with_template_fields)

    data = {"template": result.template.to_dict(), "document": result.document.to_dict()}

    return Response(json.dumps(data), mimetype="application/json", status=200)

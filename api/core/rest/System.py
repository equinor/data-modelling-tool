from flask import Blueprint, send_file, Response
from classes.data_source import DataSource
from core.use_case.create_application_use_case import CreateApplicationUseCase, CreateApplicationRequestObject
from utils.logging import logger
from core.shared import response_object as res
from core.repository.repository_factory import get_repository
from utils.enums import RepositoryType
import json

blueprint = Blueprint("system", __name__)

STATUS_CODES = {
    res.ResponseSuccess.SUCCESS: 200,
    res.ResponseFailure.RESOURCE_ERROR: 404,
    res.ResponseFailure.PARAMETERS_ERROR: 400,
    res.ResponseFailure.SYSTEM_ERROR: 500,
}


@blueprint.route("/api/v2/system/<string:data_source_id>/create-application/<string:application_id>", methods=["GET"])
def post(data_source_id: str, application_id: str):
    logger.info(f"Creating application in data source '{data_source_id}' from application settings '{application_id}'")
    data_source = DataSource(id=data_source_id)
    document_repository = get_repository(RepositoryType.DocumentRepository, data_source)
    request_object = CreateApplicationRequestObject.from_dict({"applicationId": application_id})
    use_case = CreateApplicationUseCase(document_repository)
    response = use_case.execute(request_object)

    if response.type == res.ResponseSuccess.SUCCESS:
        return send_file(
            response.value, mimetype="application/zip", as_attachment=True, attachment_filename="application.zip"
        )
    else:
        return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])

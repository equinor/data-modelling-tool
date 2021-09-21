import json

from flask import Blueprint, Response

from enums import STATUS_CODES
from use_case.delete_job import DeleteJobUseCase
from use_case.start_job import StartJobUseCase
from use_case.status_job import StatusJobUseCase

blueprint = Blueprint("jobs", __name__)


@blueprint.route("/api/job/<path:job_id>", methods=["POST"])
def start(job_id: str):
    use_case = StartJobUseCase()
    response = use_case.execute({"job_id": job_id})
    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])


@blueprint.route("/api/job/<path:job_id>", methods=["GET"])
def status(job_id: str):
    use_case = StatusJobUseCase()
    response = use_case.execute({"job_id": job_id})
    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])


@blueprint.route("/api/job/<path:job_id>", methods=["DELETE"])
def remove(job_id: str):
    use_case = DeleteJobUseCase()
    response = use_case.execute({"job_id": job_id})
    return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])

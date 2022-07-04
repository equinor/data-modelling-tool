import json
from flask import Blueprint, Response

from config import config
from enums import STATUS_CODES
from use_case.delete_job import DeleteJobUseCase
from use_case.get_result_job import GetResultJobUseCase
from use_case.start_job import StartJobUseCase
from use_case.status_job import StatusJobUseCase

blueprint = Blueprint("jobs", __name__)

if config.JOB_SERVICE_ENABLED:

    @blueprint.route("/api/job/<path:job_id>", methods=["POST"])
    def start(job_id: str):
        use_case = StartJobUseCase()
        response = use_case.execute({"job_id": job_id})
        return Response(json.dumps(response.value), mimetype="application/json", status=STATUS_CODES[response.type])
    må ha en måte å sende exceptions fra en job runner tilbake hit.. er det mulig å vente til container har startet før
    dette endepunktet returnerer noe?
    

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

    @blueprint.route("/api/job/<path:job_id>/result", methods=["GET"])
    def result(job_id: str):
        use_case = GetResultJobUseCase()
        response = use_case.execute({"job_id": job_id})
        message, bytesvalue = response.value
        return Response(
            json.dumps({"message": message, "result": bytesvalue.decode("UTF-8")}), status=STATUS_CODES[response.type]
        )

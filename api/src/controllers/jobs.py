import json

from fastapi import APIRouter
from config import config
from enums import STATUS_CODES
from use_case.delete_job import DeleteJobUseCase
from use_case.get_result_job import GetResultJobUseCase
from use_case.start_job import StartJobUseCase
from use_case.status_job import StatusJobUseCase
from starlette.responses import JSONResponse
router = APIRouter(tags=["Jobs"], prefix="/job")


if config.JOB_SERVICE_ENABLED:
    @router.post("/{job_id}", operation_id="start_job")
    def start(job_id: str):
        use_case = StartJobUseCase()
        return use_case.execute({"job_id": job_id})

    @router.get("/{job_id}", operation_id="job_status")
    def status(job_id: str):
        use_case = StatusJobUseCase()
        return use_case.execute({"job_id": job_id})

    @router.delete("/{job_id}", operation_id="remove_job")
    def remove(job_id: str):
        use_case = DeleteJobUseCase()
        return use_case.execute({"job_id": job_id})

    @router.get("/{job_id}/result", operation_id="job_result")
    def result(job_id: str):
        use_case = GetResultJobUseCase()
        response = use_case.execute({"job_id": job_id})
        message, bytesvalue = response.value
        return JSONResponse(
            json.dumps({"message": message, "result": bytesvalue.decode("UTF-8")}), status_code=STATUS_CODES[response.type]
        )

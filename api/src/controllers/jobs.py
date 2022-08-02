from fastapi import APIRouter
from config import config
from use_case.jobs.delete_job import delete_job_use_case
from use_case.jobs.get_result_job import get_job_result_use_case, GetJobResultResponse
from use_case.jobs.status_job import status_job_use_case, StatusJobResponse
from starlette.responses import JSONResponse, PlainTextResponse
from use_case.jobs.start_job import start_job_use_case

router = APIRouter(tags=["Jobs"], prefix="/job")
from restful.responses import create_response

if config.JOB_SERVICE_ENABLED:

    @router.post("/{job_id:path}", operation_id="start_job")
    @create_response(PlainTextResponse)
    def start(job_id: str):
        return start_job_use_case(job_id=job_id)

    @router.get("/{job_id:path}", operation_id="job_status", response_model=StatusJobResponse)
    @create_response(JSONResponse)
    def status(job_id: str):
        return status_job_use_case(job_id=job_id).dict()

    @router.delete("/{job_id:path}", operation_id="remove_job")
    @create_response(PlainTextResponse)
    def remove(job_id: str):
        return delete_job_use_case(job_id=job_id)

    @router.get("/{job_id:path}/result", operation_id="job_result", response_model=GetJobResultResponse)
    @create_response(JSONResponse)
    def result(job_id: str):
        return get_job_result_use_case(job_id=job_id).dict()

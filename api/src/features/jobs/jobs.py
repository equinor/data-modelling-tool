from fastapi import APIRouter
from config import config
from features.jobs.use_cases.delete_job import delete_job_use_case
from features.jobs.use_cases.get_result_job import get_job_result_use_case, GetJobResultResponse
from features.jobs.use_cases.status_job import status_job_use_case, StatusJobResponse
from starlette.responses import JSONResponse, PlainTextResponse
from features.jobs.use_cases.start_job import start_job_use_case
from restful.responses import create_response
import json
from starlette import status

router = APIRouter(tags=["Jobs"], prefix="/job")


job_service_disabled_error = JSONResponse(
    json.dumps("Error: This feature has been disabled. To enable, set 'config.JOB_SERVICE_ENABLED' to 'True'"),
    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
)


@router.post("/{job_id:path}", operation_id="start_job")
@create_response(PlainTextResponse)
def start(job_id: str):
    if not config.JOB_SERVICE_ENABLED:
        return job_service_disabled_error
    return start_job_use_case(job_id=job_id)


@router.get("/{job_id:path}", operation_id="job_status", response_model=StatusJobResponse)
@create_response(JSONResponse)
def status(job_id: str):
    if not config.JOB_SERVICE_ENABLED:
        return job_service_disabled_error
    return status_job_use_case(job_id=job_id).dict()


@router.delete("/{job_id:path}", operation_id="remove_job")
@create_response(PlainTextResponse)
def remove(job_id: str):
    if not config.JOB_SERVICE_ENABLED:
        return job_service_disabled_error
    return delete_job_use_case(job_id=job_id)


@router.get("/{job_id:path}/result", operation_id="job_result", response_model=GetJobResultResponse)
@create_response(JSONResponse)
def result(job_id: str):
    if not config.JOB_SERVICE_ENABLED:
        return job_service_disabled_error
    return get_job_result_use_case(job_id=job_id).dict()

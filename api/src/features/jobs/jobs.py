from fastapi import APIRouter
from starlette.responses import JSONResponse, PlainTextResponse

from config import config
from features.jobs.use_cases.delete_job import delete_job_use_case
from features.jobs.use_cases.get_result_job import (
    GetJobResultResponse,
    get_job_result_use_case,
)
from features.jobs.use_cases.start_job import StartJobResponse, start_job_use_case
from features.jobs.use_cases.status_job import StatusJobResponse, status_job_use_case
from restful.responses import create_response, responses

router = APIRouter(tags=["DMT", "Jobs"], prefix="/job")

job_service_disabled_error = (
    "Error: This feature in the job API has been disabled. To enable, set 'config.JOB_SERVICE_ENABLED' to 'True'"
)


@router.post("/{job_dmss_id:path}", operation_id="start_job", response_model=StartJobResponse, responses=responses)
@create_response(JSONResponse)
def start(job_dmss_id: str):
    if not config.JOB_SERVICE_ENABLED:
        raise Exception(job_service_disabled_error)
    return start_job_use_case(job_dmss_id=job_dmss_id).dict()


@router.get("/{job_uid}", operation_id="job_status", response_model=StatusJobResponse, responses=responses)
@create_response(JSONResponse)
def status(job_uid: str):
    if not config.JOB_SERVICE_ENABLED:
        raise Exception(job_service_disabled_error)
    return status_job_use_case(job_id=job_uid).dict()


@router.delete("/{job_uid}", operation_id="remove_job", responses=responses)
@create_response(PlainTextResponse)
def remove(job_uid: str):
    if not config.JOB_SERVICE_ENABLED:
        raise Exception(job_service_disabled_error)
    return delete_job_use_case(job_id=job_uid)


@router.get("/{job_uid}/result", operation_id="job_result", response_model=GetJobResultResponse, responses=responses)
@create_response(JSONResponse)
def result(job_uid: str):
    if not config.JOB_SERVICE_ENABLED:
        raise Exception(job_service_disabled_error)
    return get_job_result_use_case(job_uid=job_uid).dict()

from services.job_service import JobService
from services.job_handler_interface import JobStatus
from pydantic import BaseModel


class StatusJobResponse(BaseModel):
    status: JobStatus
    log: str | None
    message: str


def status_job_use_case(job_id: str) -> StatusJobResponse:
    job_service = JobService()
    status, log, message = job_service.status_job(job_id)
    return StatusJobResponse(**{"status": status.value, "log": log, "message": message})

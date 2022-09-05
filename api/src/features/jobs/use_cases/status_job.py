from uuid import UUID

from pydantic import BaseModel

from services.job_handler_interface import JobStatus
from services.job_service import JobService


class StatusJobResponse(BaseModel):
    status: JobStatus
    log: str | None
    message: str

    class Config:
        use_enum_values = True


def status_job_use_case(job_id: str) -> StatusJobResponse:
    job_service = JobService()
    status, log, message = job_service.status_job(UUID(job_id))
    return StatusJobResponse(**{"status": status.value, "log": log, "message": message})

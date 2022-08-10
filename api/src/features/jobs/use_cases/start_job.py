from typing import Tuple

from pydantic.main import BaseModel

from services.job_service import JobService


class StartJobResponse(BaseModel):
    message: str
    uid: str


def start_job_use_case(job_dmss_id: str) -> StartJobResponse:
    job_service = JobService()
    result: Tuple[str, str] = job_service.register_job(job_dmss_id)
    return StartJobResponse(**{"message": result[1], "uid": result[0]})

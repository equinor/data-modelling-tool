from services.job_service import JobService
from pydantic import BaseModel


class GetJobResultResponse(BaseModel):
    message: str
    result: str


def get_job_result_use_case(job_id: str) -> GetJobResultResponse:
    job_service = JobService()
    message, bytesvalue = job_service.get_job_result(job_id)
    return GetJobResultResponse(**{"message": message, "result": bytesvalue.decode("UTF-8")})

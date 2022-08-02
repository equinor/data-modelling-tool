from restful import use_case as uc
from services.job_service import JobService
from starlette.responses import JSONResponse


def start_job_use_case(job_id: str) -> str:
    job_service = JobService()
    result: str = job_service.register_job(job_id)
    return result

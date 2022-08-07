from services.job_service import JobService


def delete_job_use_case(job_id: str) -> str:
    job_service = JobService()
    result: str = job_service.remove_job(job_id)
    return result

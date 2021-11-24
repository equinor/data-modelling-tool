from restful import response_object as res
from restful import use_case as uc
from services.job_service import JobService


class StatusJobUseCase(uc.UseCase):
    def process_request(self, request_object):
        job_service = JobService()
        status, log, message = job_service.status_job(request_object["job_id"])
        return res.ResponseSuccess({"status": status.value, "log": log, "message": message})

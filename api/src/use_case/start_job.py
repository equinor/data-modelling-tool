from restful import response_object as res
from restful import use_case as uc
from services.job_service import JobService


class StartJobUseCase(uc.UseCase):
    def process_request(self, request_object):
        job_service = JobService()
        result = job_service.start_job(request_object["job_id"])
        return res.ResponseSuccess(result)

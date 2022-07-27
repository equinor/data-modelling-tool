from restful import use_case as uc
from services.job_service import JobService
from starlette.responses import JSONResponse


class GetResultJobUseCase(uc.UseCase):
    def process_request(self, request_object):
        job_service = JobService()
        result = job_service.get_job_result(request_object["job_id"])
        return JSONResponse(result)

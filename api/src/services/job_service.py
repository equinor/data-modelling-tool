from datetime import datetime
from typing import Dict, Tuple

from job_handlers.azure_container_instances import HandleAzureContainerInstanceJobs
from job_handlers.job_handler_interface import Job, JobHandlerInterface, JobStatus
from job_handlers.local_shell import HandleLocalShellJobs
from repository.repository_exceptions import JobNotFoundException
from services.dmss import get_document_by_uid

# TODO: Perhaps move to something like Redis
job_store: Dict[str, Job] = {}


class JobService:
    @staticmethod
    def _get_job_entity(job_id: str):
        data_source_id, job_entity_id = job_id.split("/", 1)
        return get_document_by_uid(data_source_id, job_entity_id)

    def _get_job_handler(self, job_id: str) -> JobHandlerInterface:
        job_entity = self._get_job_entity(job_id)
        data_source_id, job_entity_id = job_id.split("/", 1)

        if job_entity["type"] == "DMT-Internal/DMT/AzureContainerInstanceJob":
            return HandleAzureContainerInstanceJobs(data_source_id, job_entity)
        if job_entity["type"] == "DMT-Internal/DMT/ShellJob":
            return HandleLocalShellJobs(data_source_id, job_entity)
        else:
            raise NotImplementedError(f"No handler for a job of type '{job_entity['type']}' is configured")

    def start_job(self, job_id: str):
        if job_id in job_store:
            raise Exception("This job is already registered. Create a new job, or delete the old one.")
        job_handler = self._get_job_handler(job_id)
        start_output = job_handler.start()
        job = Job(job_id=job_id, started=datetime.now(), status=JobStatus.STARTING, log=start_output)
        job_store[job.job_id] = job
        return start_output

    def status_job(self, job_id: str) -> Tuple[JobStatus, str]:
        if job_id not in job_store:
            raise JobNotFoundException(f"No job with id '{job_id}' is registered")
        job_handler = self._get_job_handler(job_id)
        status, log = job_handler.progress()
        job_store[job_id].status = status
        job_store[job_id].log = log
        return status, job_store[job_id].log

    def remove_job(self, job_id: str) -> str:
        if job_id not in job_store:
            raise JobNotFoundException(f"No job with id '{job_id}' is registered")
        job_handler = self._get_job_handler(job_id)
        job_status, remove_message = job_handler.remove()
        try:
            del job_store[job_id]
        except KeyError:
            raise JobNotFoundException(f"No job with id '{job_id}' is registered")
        return remove_message

import importlib
import json
from datetime import datetime
from pathlib import Path
from typing import Tuple, Union

import redis
from home.DMT.job_handlers.job_handler_interface import Job, JobHandlerInterface, JobStatus
from redis import AuthenticationError

from config import config
from repository.repository_exceptions import JobNotFoundException
from services.dmss import get_document_by_uid


# TODO: Authorization. The only level of authorization at this point is to allow all that
#  can view the job entity to also run and delete the job.
class JobService:
    def __init__(self):
        self.job_store = redis.Redis(
            host=config.SCHEDULER_REDIS_HOST,
            port=config.SCHEDULER_REDIS_PORT,
            db=0,
            password=config.SCHEDULER_REDIS_PASSWORD,
            ssl=True,
        )

    def _set_job(self, job: Job):
        return self.job_store.set(job.job_id, json.dumps(job.to_dict()))

    def _get_job(self, job_id: str) -> Union[Job, None]:
        try:
            if raw_job := self.job_store.get(job_id):
                return Job.from_dict(json.loads(raw_job.decode()))
        except AuthenticationError:
            raise ValueError(
                "Tried to fetch a job from Redis but no password"
                + " was supplied. Make sure SCHEDULER_REDIS_PASSWORD is set."
            )
        return None

    @staticmethod
    def _get_job_entity(job_id: str):
        data_source_id, job_entity_id = job_id.split("/", 1)
        return get_document_by_uid(data_source_id, job_entity_id)

    def _get_job_handler(self, job_id: str) -> JobHandlerInterface:
        job_entity = self._get_job_entity(job_id)
        data_source_id, job_entity_id = job_id.split("/", 1)

        job_handler_directories = [
            str(f) for f in Path(f"{config.APPLICATION_HOME}/DMT/job_handlers").iterdir() if f.is_dir()
        ]

        module_paths = [
            f"home{f.removeprefix(config.APPLICATION_HOME).replace('/', '.')}" for f in job_handler_directories
        ]

        try:
            modules = [importlib.import_module(module) for module in module_paths]
            for job_handler_module in modules:
                if job_entity["type"] == job_handler_module._SUPPORTED_JOB_TYPE:
                    return job_handler_module.JobHandler(data_source_id, job_entity)
        except Exception as error:
            raise Exception(
                f"Failed to import a job handler module: '{error}'"
                + "Make sure the module has a '_init_.py' file, a 'JobHandler' class implementing "
                + "the JobHandlerInterface, and a global variable named '_SUPPORTED_JOB_TYPE' "
                + "with the string value of the job type."
            )

        raise NotImplementedError(f"No handler for a job of type '{job_entity['type']}' is configured")

    def start_job(self, job_id: str):
        if self._get_job(job_id):
            raise Exception("This job is already registered. Create a new job, or delete the old one.")
        job_handler = self._get_job_handler(job_id)
        start_output = job_handler.start()
        job = Job(job_id=job_id, started=datetime.now(), status=JobStatus.STARTING, log=start_output)
        self._set_job(job)
        return start_output

    def status_job(self, job_id: str) -> Tuple[JobStatus, str]:
        job = self._get_job(job_id)
        if not job:
            raise JobNotFoundException(f"No job with id '{job_id}' is registered")
        job_handler = self._get_job_handler(job_id)
        status, log = job_handler.progress()
        job.status = status
        job.log = log
        self._set_job(job)
        return status, job.log

    def remove_job(self, job_id: str) -> str:
        job = self._get_job(job_id)
        if not job:
            raise JobNotFoundException(f"No job with id '{job_id}' is registered")
        job_handler = self._get_job_handler(job_id)
        job_status, remove_message = job_handler.remove()
        self.job_store.delete(job_id)
        return remove_message

import importlib
import json
import traceback
from datetime import datetime
from pathlib import Path
from typing import Callable, Tuple, Union
from uuid import UUID, uuid4

import redis
import requests
from apscheduler.schedulers.background import BackgroundScheduler
from redis import AuthenticationError

from config import config
from enums import SIMOS
from restful.exceptions import NotFoundException
from services.dmss import (
    get_document_by_uid,
    get_personal_access_token,
    update_document_by_uid,
)

# TODO: Authorization. The only level of authorization at this point is to allow all that
#  can view the job entity to also run and delete the job.
from services.job_handler_interface import Job, JobHandlerInterface, JobStatus
from services.job_scheduler import scheduler
from utils.get_extends_from import get_extends_from
from utils.logging import logger
from utils.string_helpers import split_absolute_ref


def is_cron_job(blueprint_ref: str) -> bool:
    """Checks if the type SIMOS.CRONJOB is in the list of types the blueprint extends from"""
    all_extends = get_extends_from(blueprint_ref)
    return SIMOS.CRON_JOB.value in all_extends


def schedule_cron_job(scheduler: BackgroundScheduler, function: Callable, job: Job) -> str:
    if not job.entity.get("cron"):
        raise ValueError("CronJob entity is missing required attribute 'cron'")
    try:
        minute, hour, day, month, day_of_week = job.entity["cron"].split(" ")
        scheduled_job = scheduler.add_job(
            function,
            "cron",
            minute=minute,
            hour=hour,
            day=day,
            month=month,
            day_of_week=day_of_week,
            id=str(job.job_uid),
            replace_existing=True,
        )
        return (
            "Cron job successfully registered. Next scheduled run "
            + f"at {scheduled_job.next_run_time} {scheduled_job.next_run_time.tzinfo}"
        )
    except ValueError as e:
        raise ValueError(f"Failed to schedule cron job '{job.job_uid}'. {e}'")


class JobService:
    def __init__(self):
        self.job_store = redis.Redis(
            host=config.SCHEDULER_REDIS_HOST,
            port=config.SCHEDULER_REDIS_PORT,
            db=0,
            password=config.SCHEDULER_REDIS_PASSWORD,
            ssl=config.SCHEDULER_REDIS_SSL,
            socket_timeout=5,
            socket_connect_timeout=5,
        )

    def load_cron_jobs(self):
        for key in self.job_store.scan_iter():
            job = self._get_job(UUID(key.decode()))
            if job.cron_job:
                schedule_cron_job(scheduler, lambda: self._run_job(job.job_uid), job)
                logger.info(f"Loaded and registered job '{job.job_uid}' from {config.SCHEDULER_REDIS_HOST}")

    def _set_job(self, job: Job):
        return self.job_store.set(str(job.job_uid), json.dumps(job.to_dict()))

    def _get_job(self, job_uid: UUID) -> Union[Job, None]:
        try:
            if raw_job := self.job_store.get(str(job_uid)):
                return Job.from_dict(json.loads(raw_job.decode()))
        except AuthenticationError:
            raise ValueError(
                "Tried to fetch a job from Redis but no password"
                + " was supplied. Make sure SCHEDULER_REDIS_PASSWORD is set."
            )
        return None

    @staticmethod
    def _get_job_entity(dmss_id: str, token: str = None):
        data_source_id, job_entity_id, attribute = split_absolute_ref(dmss_id)
        return get_document_by_uid(data_source_id, job_entity_id, attribute=attribute, token=token, depth=0)

    @staticmethod
    def _insert_reference(document_id: str, reference: dict, token: str = None):
        headers = {"Access-Key": token}
        req = requests.put(f"{config.DMSS_API}/api/v1/reference/{document_id}", json=reference, headers=headers)
        req.raise_for_status()

        return req.json()

    @staticmethod
    def _update_job_entity(dmss_id: str, job_entity: dict, token: str):
        return update_document_by_uid(dmss_id, {"data": job_entity}, token=token)

    def _get_job_handler(self, job: Job) -> JobHandlerInterface:
        data_source_id = job.dmss_id.split("/", 1)[0]

        job_handler_directories = []
        for app in config.APP_NAMES:
            try:
                for f in Path(f"{config.APPLICATION_HOME}/{app}/job_handlers").iterdir():
                    if f.is_dir() and f.name[0] != "_":  # Python modules can not start with "_"
                        job_handler_directories.append(str(f))
            except FileNotFoundError:
                pass

        module_paths = [
            f"home{f.removeprefix(config.APPLICATION_HOME).replace('/', '.')}" for f in job_handler_directories
        ]

        try:
            modules = [importlib.import_module(module) for module in module_paths]
            for job_handler_module in modules:
                if job.entity["runner"]["type"] == job_handler_module._SUPPORTED_TYPE:
                    return job_handler_module.JobHandler(job, data_source_id)
        except ImportError as error:
            traceback.print_exc()
            raise ImportError(
                f"Failed to import a job handler module: '{error}'"
                + "Make sure the module has a '_init_.py' file, a 'JobHandler' class implementing "
                + "the JobHandlerInterface, and a global variable named '_SUPPORTED_TYPE' "
                + "with the string, tuple, or list value of the job type(s)."
            )

        raise NotImplementedError(f"No handler for a job of type '{job.entity['runner']['type']}' is configured")

    def _run_job(self, job_uid: UUID) -> str:
        job: Job = self._get_job(job_uid)
        try:
            job_handler = self._get_job_handler(job)
            job.started = datetime.now()
            job.status = JobStatus.STARTING
            try:
                job.log = job_handler.start()
            except Exception as error:
                print(traceback.format_exc())
                logger.warning(f"Failed to run job; {job_uid}")
                job.status = JobStatus.FAILED
                raise error
        except NotImplementedError as error:
            job.log = (
                f"{job.log}\n\nThe jobHandler '{type(job_handler).__name__}' is missing some implementations: {error}"
            )
        except KeyError as error:
            job.log = (
                f"{job.log}\n\nThe jobHandler '{type(job_handler).__name__}' "
                f"tried to access a missing attribute: {error}"
            )
        except Exception as error:
            job.log = f"{job.log}\n\n{error}"
        finally:
            job.update_entity_attributes()
            self._update_job_entity(job.dmss_id, job.entity, job.token)  # Update in DMSS with status etc.
            self._set_job(job)
            return job.log

    def register_job(self, dmss_id: str) -> Tuple[str, str]:
        # A token must be created when there still is a request object.
        token = get_personal_access_token()
        job_entity = self._get_job_entity(dmss_id, token)

        if False:  # TODO: Reimplement cron-job support
            # if is_cron_job(job_entity["type"]):
            job = Job(
                dmss_id=dmss_id,
                started=datetime.now(),
                status=JobStatus.REGISTERED,
                entity=job_entity,
                cron_job=True,
                token=token,
            )
            self._get_job_handler(job)  # Test for available handler before registering
            result = schedule_cron_job(scheduler, lambda: self._run_job(dmss_id), job)
        else:
            job = Job(
                job_uid=uuid4(),
                dmss_id=dmss_id,
                started=datetime.now(),
                status=JobStatus.REGISTERED,
                entity=job_entity,
                token=token,
            )
            self._get_job_handler(job)
            scheduler.add_job(lambda: self._run_job(job.job_uid))
            result = str(job.job_uid), "Job successfully started"

        self._set_job(job)
        job.update_entity_attributes()
        self._update_job_entity(job.dmss_id, job.entity, job.token)
        return result

    def status_job(self, job_uid: UUID) -> Tuple[JobStatus, str, str]:
        job = self._get_job(job_uid)
        if not job:
            raise NotFoundException(f"No job with uid '{job_uid}' is registered")
        job_handler = self._get_job_handler(job)
        status, log = job_handler.progress()
        if status is JobStatus.COMPLETED:
            result_reference = self._get_job_entity(job.dmss_id, job.token)["result"]
            job.entity["result"] = result_reference
        job.status = status
        job.log = log
        self._set_job(job)
        job.update_entity_attributes()
        self._update_job_entity(job.dmss_id, job.entity, job.token)
        if job.cron_job:
            cron_job = scheduler.get_job(job_uid)
            return status, job.log, f"Next scheduled run @ {cron_job.next_run_time} {cron_job.next_run_time.tzinfo}"
        return status, job.log, f"Started: {job.started.isoformat()}"

    def remove_job(self, job_uid: UUID) -> str:
        job = self._get_job(job_uid)
        if not job:
            raise NotFoundException(f"No job with id '{job_uid}' is registered")
        job_handler = self._get_job_handler(job)
        job_status, remove_message = job_handler.remove()
        self.job_store.delete(str(job_uid))
        return remove_message

    def get_job_result(self, job_uid: UUID) -> Tuple[str, bytearray]:
        job = self._get_job(job_uid)
        if not job:
            raise NotFoundException(f"No job with id '{job_uid}' is registered")
        job_handler = self._get_job_handler(job)
        return job_handler.result()

import docker
from docker.errors import DockerException
from typing import Tuple

from config import config
from services.job_handler_interface import JobHandlerInterface, JobStatus
from utils.logging import logger

import os

_SUPPORTED_TYPE = "WorkflowDS/Blueprints/jobHandlers/Container"


class JobHandler(JobHandlerInterface):
    """
    A job handler to run local docker container. This is similar to the local_containers job handler in DMT, but uses
    a different blueprint
    """

    # todo consider implementing a pydantic class to check that job_entity is in correct format
    def __init__(self, job, data_source: str):
        super().__init__(job, data_source)
        self.headers = {"Access-Key": job.token}
        try:
            self.client = docker.from_env()
        except DockerException:
            raise DockerException(
                (
                    "Failed to get a docker client. Docker must be installed on this host, or "
                    + "the /var/run/docker.sock must be made available (volume mount)."
                    + "Make sure you are aware of the serious security risk this entails."
                )
            )

    def start(self) -> str:
        try:
            reference_target: str = self.job.entity["referenceTarget"]
            runner_entity: dict = self.job.entity["runner"]
            logger.info(f"JobName: '{self.job.job_id}'." + " Starting Local Container job...")
            logger.info(
                "Creating container\n\t"
                + f"Image: '{runner_entity['image']}'\n\t"
                + f"Command: '--job-id={self.job.job_id}.applicationInput'"
            )
            envs = [f"{e}={os.getenv(e)}" for e in config.SCHEDULER_ENVS_TO_EXPORT if os.getenv(e)]

            envs.append(f"DMSS_TOKEN={self.job.token}")
            self.client.containers.run(
                image=runner_entity["image"],
                command=[
                    "/code/init.sh",
                    f"--input-id={self.data_source}/{self.job.entity['applicationInput']['_id']}",
                    f"--reference-target={reference_target}",
                ],
                name=self.job.entity["name"],
                environment=envs,
                network="data-modelling-storage-service_default",
                detach=True,
            )

        except KeyError as error:
            raise Exception(
                f"Job entity used as input to local container jobs does not include required attribute {error}"
            )

        logger.info("*** Local container job completed ***")
        return "Ok"

    def remove(self) -> str:
        container = self.client.containers.get(self.job.entity["name"])
        container.remove()
        return JobStatus.UNKNOWN, "Removed"

    def progress(self) -> Tuple[JobStatus, str]:
        """Poll progress from the job instance"""
        try:
            container = self.client.containers.get(self.job.entity["name"])
            logs = container.logs()
            return JobStatus.UNKNOWN, logs.decode()
        except docker.errors.NotFound as error:
            logger.error(f"Failed to poll progress of local container: {error}")
            return JobStatus.UNKNOWN, ""

    def result(self) -> Tuple[str, bytearray]:
        return "test 123", b"lkjgfdakljhfdgsllkjhldafgoiu8y03q987hgbloizdjhfpg980"

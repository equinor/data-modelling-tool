import os
from typing import Tuple

import docker
from docker.errors import DockerException

from config import config
from services.job_handler_interface import Job, JobHandlerInterface, JobStatus
from utils.logging import logger

_SUPPORTED_TYPE = "WorkflowDS/Blueprints/jobHandlers/Container"


class JobHandler(JobHandlerInterface):
    """
    A job handler to run local docker container. This is similar to the local_containers job handler in DMT, but uses
    a different blueprint
    """

    # todo consider implementing a pydantic class to check that job_entity is in correct format
    def __init__(self, job: Job, data_source: str):
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
        reference_target: str = self.job.entity.get("referenceTarget", None)
        runner_entity: dict = self.job.entity["runner"]
        full_image_name: str = (
            f"{runner_entity['image']['registryName']}/{runner_entity['image']['imageName']}"
            + f":{runner_entity['image']['version']}"
        )
        logger.info(f"Job path: '{self.job.dmss_id} ({self.job.job_uid})'." + " Starting Local Container job...")
        logger.info(
            "Creating container\n\t"
            + f"Image: '{full_image_name}'\n\t"
            + f"Command: /code/init.sh --input-id={self.data_source}/{self.job.entity['applicationInput']['_id']}"
        )
        envs = [f"{e}={os.getenv(e)}" for e in config.SCHEDULER_ENVS_TO_EXPORT if os.getenv(e)]
        command_list = [
            "/code/init.sh",
            f"--input-id={self.data_source}/{self.job.entity['applicationInput']['_id']}",
        ]
        if reference_target:
            command_list.append(f"--reference-target={reference_target}")

        envs.append(f"DMSS_TOKEN={self.job.token}")
        self.client.containers.run(
            image=full_image_name,
            command=command_list,
            name=self.job.entity["name"],
            environment=envs,
            network="data-modelling-storage-service_default",
            detach=True,
        )
        logger.info("*** Local container job started successfully ***")
        return "Ok"

    def remove(self) -> Tuple[str, str]:
        try:
            container = self.client.containers.get(self.job.entity["name"])
            container.remove()
        except docker.errors.NotFound:
            pass
        return JobStatus.REMOVED, "Removed"

    def progress(self) -> Tuple[JobStatus, str]:
        """Poll progress from the job instance"""
        if self.job.status == JobStatus.FAILED:
            # If setup fails, the container is not started
            return self.job.status, self.job.log
        try:
            container = self.client.containers.get(self.job.entity["name"])
            status = self.job.status
            if container.status == "running":
                status = JobStatus.RUNNING
            elif container.attrs["State"]["ExitCode"] >= 1:
                status = JobStatus.FAILED
            elif container.attrs["State"]["ExitCode"] == 0:
                status = JobStatus.COMPLETED
            logs = container.logs()
            return status, logs.decode()
        except docker.errors.NotFound as error:
            logger.error(f"Failed to poll progress of local container: {error}")
            return JobStatus.UNKNOWN, self.job.log

    def result(self) -> Tuple[str, bytearray]:
        return "test 123", b"lkjgfdakljhfdgsllkjhldafgoiu8y03q987hgbloizdjhfpg980"

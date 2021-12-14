from typing import Tuple

import docker
import os
from docker.errors import DockerException

from config import config
from services.job_handler_interface import JobStatus, ServiceJobHandlerInterface
from utils.logging import logger

_SUPPORTED_JOB_TYPE = "DMT-Internal/DMT/Jobs/Container"


class JobHandler(ServiceJobHandlerInterface):
    """
    Job handler plugin for running "sibling" Docker containers (docker-in-docker).
    Support both executable jobs and job services
    """

    def __init__(self, data_source: str, job_entity: dict, token: str):
        super().__init__(data_source, job_entity, token)
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

    def teardown_service(self, service_id: str) -> str:
        raise NotImplementedError

    def setup_service(self, service_id: str) -> str:
        raise NotImplementedError

    def start(self) -> str:
        logger.info(
            f"JobName: '{self.job_entity.get('_id', self.job_entity.get('name'))}'."
            + " Starting Local Container job..."
        )

        logger.info(
            "Creating container\n\t"
            + f"Image: '{self.job_entity['image']}'\n\t"
            + f"Command: {self.job_entity.get('command', 'None')}"
        )

        env_vars = [
            f"{e}={os.getenv(e)}" for e in config.SCHEDULER_ENVS_TO_EXPORT if os.getenv(e)
        ] + self.job_entity.get("environmentVariables", [])

        self.client.containers.run(
            image=self.job_entity["image"],
            command=self.job_entity.get("command") + [f"--token={self.token}"],
            name=self.job_entity["name"],
            environment=env_vars,
            network="forecast-of-response-dmt_for-network",
            detach=True,
        )

        logger.setLevel(config.LOGGER_LEVEL)  # I could not find the correctly named logger for this...
        return "Ok"

    def remove(self) -> Tuple[JobStatus, str]:
        container = self.client.containers.get(self.job_entity["name"])
        container.remove()
        return JobStatus.UNKNOWN, "Removed"

    def progress(self) -> Tuple[JobStatus, str]:
        """Poll progress from the job instance"""
        container = self.client.containers.get(self.job_entity["name"])
        logs = container.logs()
        return JobStatus.UNKNOWN, logs.decode()

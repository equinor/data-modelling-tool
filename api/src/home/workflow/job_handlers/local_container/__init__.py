import docker
from docker.errors import DockerException
from typing import Tuple
from services.job_handler_interface import JobHandlerInterface, JobStatus
from utils.logging import logger
from dmss_api.apis import DefaultApi
import json

import os

_SUPPORTED_TYPE = "WorkflowDS/Blueprints/jobHandlers/Container"


class Settings:
    PUBLIC_DMSS_API: str = os.getenv("PUBLIC_DMSS_API", "http://dmss:5000")


dmss_api = DefaultApi()
settings = Settings()
dmss_api.api_client.configuration.host = settings.PUBLIC_DMSS_API


class JobHandler(JobHandlerInterface):
    """
    A job handler to run local docker container. This is similar to the local_containers job handler in DMT, but uses
    a different blueprint
    """

    # todo consider implementing a pydantic class to check that job_entity is in correct format
    def __init__(self, data_source: str, job_entity: dict, token: str, insert_reference: callable):
        super().__init__(data_source, job_entity, token, insert_reference)
        self.headers = {"Access-Key": token}
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
            runnerEntity: dict = self.job_entity["runner"]
            logger.info(
                f"JobName: '{self.job_entity.get('_id', self.job_entity.get('name'))}'."
                + " Starting Local Container job..."
            )
            logger.info(f"job_entity is {self.job_entity}")

            logger.info(
                "Creating container\n\t"
                + f"Image: '{runnerEntity['image']}'\n\t"
                + f"Command: {runnerEntity.get('command', 'None')}"
            )
            json_separators = (
                ",",
                ":",
            )
            app_input = json.dumps(self.job_entity["applicationInput"], separators=json_separators)

            self.client.containers.run(
                image=runnerEntity["image"],
                command=runnerEntity["command"] + [f"--token={self.token}", f"--application-input={app_input}"],
                name=self.job_entity["name"],
                environment=["SIMA_LICENSE=NONE"],
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
        container = self.client.containers.get(self.job_entity["name"])
        container.remove()
        return JobStatus.UNKNOWN, "Removed"

    def progress(self) -> Tuple[JobStatus, str]:
        """Poll progress from the job instance"""
        container = self.client.containers.get(self.job_entity["name"])
        logs = container.logs()
        return JobStatus.UNKNOWN, logs.decode()

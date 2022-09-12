import logging
import os
from collections import namedtuple
from time import sleep
from typing import Tuple

from azure.core.exceptions import ResourceNotFoundError
from azure.identity import ClientSecretCredential
from azure.mgmt.containerinstance import ContainerInstanceManagementClient
from azure.mgmt.containerinstance.models import (
    Container,
    ContainerGroup,
    ContainerGroupRestartPolicy,
    EnvironmentVariable,
    OperatingSystemTypes,
    ResourceRequests,
    ResourceRequirements,
)

from config import config
from restful.exceptions import NotFoundException
from services.job_handler_interface import JobHandlerInterface, JobStatus
from utils.logging import logger

AccessToken = namedtuple("AccessToken", ["token", "expires_on"])
logging.getLogger("azure").setLevel(logging.WARNING)

_SUPPORTED_TYPE = "WorkflowDS/Blueprints/jobHandlers/AzureContainer"


class JobHandler(JobHandlerInterface):
    """
    Job handler plugin for Azure Container Instances.
    Support both executable jobs and job services
    """

    def __init__(self, job, data_source: str):
        super().__init__(job, data_source)
        logger.setLevel(logging.WARNING)  # I could not find the correctly named logger for this...
        azure_credentials = ClientSecretCredential(
            client_id=config.AZURE_JOB_SP_CLIENT_ID,
            client_secret=config.AZURE_JOB_SP_SECRET,
            tenant_id=config.AZURE_JOB_SP_TENANT_ID,
        )
        self.azure_valid_container_name = self.job.entity["name"].lower().replace(".", "-")
        self.aci_client = ContainerInstanceManagementClient(
            azure_credentials, subscription_id=config.AZURE_JOB_SUBSCRIPTION
        )
        logger.setLevel(config.LOGGER_LEVEL)

    def teardown_service(self, service_id: str) -> str:
        raise NotImplementedError

    def setup_service(self, service_id: str) -> str:
        raise NotImplementedError

    def start(self) -> str:
        logger.info(f"JobName: '{self.job.job_id}'. Starting Azure Container job...")

        # Add env-vars from deployment first
        env_vars: list[EnvironmentVariable] = [
            EnvironmentVariable(name=e, value=os.getenv(e)) for e in config.SCHEDULER_ENVS_TO_EXPORT if os.getenv(e)
        ]

        env_vars.append(EnvironmentVariable(name="DMSS_TOKEN", value=self.job.token))

        # Parse env-vars from job entity
        for env_string in self.job.entity.get("environmentVariables", []):
            key, value = env_string.split("=", 1)
            env_vars.append(EnvironmentVariable(name=key, value=value))
        reference_target: str = self.job.entity.get("referenceTarget", None)
        runner_entity: dict = self.job.entity["runner"]
        if not runner_entity["image"]["registryName"]:
            raise ValueError("Container image in job runner")
        full_image_name: str = (
            f"{runner_entity['image']['registryName']}/{runner_entity['image']['imageName']}"
            + f":{runner_entity['image']['version']}"
        )
        logger.info(
            f"Creating Azure container '{self.azure_valid_container_name}':\n\t"
            + f"Image: '{full_image_name}'\n\t"
            + "RegistryUsername: 'None'"
        )
        command_list = [
            "/code/init.sh",
            f"--input-id={self.data_source}/{self.job.entity['applicationInput']['_id']}",
        ]
        if reference_target:
            command_list.append(f"--reference-target={reference_target}")
        compute_resources = ResourceRequests(memory_in_gb=1.5, cpu=1.0)
        container = Container(
            name=self.azure_valid_container_name,
            image=full_image_name,
            resources=ResourceRequirements(requests=compute_resources),
            command=command_list,
            environment_variables=env_vars,
        )
        image_registry_credential = None

        # Configure the container group
        group = ContainerGroup(
            location="norwayeast",
            containers=[container],
            os_type=OperatingSystemTypes.linux,
            restart_policy=ContainerGroupRestartPolicy.never,
            image_registry_credentials=image_registry_credential,
        )

        # Create the container group
        result = self.aci_client.container_groups.begin_create_or_update(
            config.AZURE_JOB_RESOURCE_GROUP, self.azure_valid_container_name, group
        )

        return result.status()

        logger.info("*** Azure container job started successfully ***")
        return result.status()

    def remove(self) -> Tuple[JobStatus, str]:
        logger.setLevel(logging.WARNING)
        operation = self.aci_client.container_groups.begin_delete(
            config.AZURE_JOB_RESOURCE_GROUP, self.azure_valid_container_name
        )
        logger.setLevel(config.LOGGER_LEVEL)
        status = operation.status()
        for i in range(4):
            status = operation.status()
            if status == "Succeeded":
                break
            sleep(2)
        job_status = JobStatus.UNKNOWN
        if status == "Succeeded":
            job_status = JobStatus.COMPLETED
        return job_status, status

    def progress(self) -> Tuple[JobStatus, str]:
        """Poll progress from the job instance"""
        if self.job.status == JobStatus.FAILED:
            # If setup fails, the container is not started
            return self.job.status, self.job.log
        try:
            logger.setLevel(logging.WARNING)
            logs = self.aci_client.containers.list_logs(
                config.AZURE_JOB_RESOURCE_GROUP, self.azure_valid_container_name, self.azure_valid_container_name
            ).content
            logger.setLevel(config.LOGGER_LEVEL)
        except ResourceNotFoundError:
            raise NotFoundException(
                f"The container '{self.azure_valid_container_name}' does not exist. "
                + "Either it has not been created, or it's not ready to accept requests."
            )
        container_group = self.aci_client.container_groups.get(
            config.AZURE_JOB_RESOURCE_GROUP, self.azure_valid_container_name
        )
        status = container_group.containers[0].instance_view.current_state.state
        exit_code = container_group.containers[0].instance_view.current_state.exit_code
        if not logs:  # If no container logs, get the Container Instance events instead
            try:
                logs = container_group.containers[0].instance_view.events[-1].message
            except TypeError:
                logs = self.job.log
                pass

        job_status = self.job.status

        # Flake8 does not have support for match case syntax. Using noqa to disable warnings.
        match (status, exit_code):  # noqa
            case ("Running", None):  # noqa
                job_status = JobStatus.RUNNING
            case ("Terminated", 0):  # noqa
                job_status = JobStatus.COMPLETED
            case ("Terminated", exit_code) if exit_code >= 1:  # noqa
                job_status = JobStatus.FAILED
            case ("Waiting", None):  # noqa
                job_status = JobStatus.STARTING
        return job_status, logs

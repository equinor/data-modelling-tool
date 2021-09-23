import logging
from collections import namedtuple
from time import sleep
from typing import Tuple

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
from msrestazure.azure_active_directory import ServicePrincipalCredentials
from azure.core.exceptions import ResourceNotFoundError

from config import config
from job_handlers.job_handler_interface import JobStatus, ServiceJobHandlerInterface
from repository.repository_exceptions import JobNotFoundException
from utils.logging import logger

AccessToken = namedtuple("AccessToken", ["token", "expires_on"])
logging.getLogger("azure").setLevel(logging.WARNING)


class AzureTokenClass:  # TODO: Replace with one from the azure libraries.
    def __init__(self, token):
        self.token: AccessToken = AccessToken(token["access_token"], token["expires_on"])

    def get_token(self, *args, **kwargs):
        return self.token


class HandleAzureContainerInstanceJobs(ServiceJobHandlerInterface):
    """
    Job handler plugin for Azure Container Instances.
    Support both executable jobs and job services
    """

    def teardown_service(self, service_id: str) -> str:
        raise NotImplementedError

    def setup_service(self, service_id: str) -> str:
        raise NotImplementedError

    def __init__(self, data_source: str, job_entity: dict):
        super().__init__(data_source, job_entity)
        logger.setLevel(logging.WARNING)  # I could not find the correctly named logger for this...
        azure_credentials = ServicePrincipalCredentials(
            config.AZURE_JOB_SP_CLIENT_ID, config.AZURE_JOB_SP_SECRET, tenant=config.AZURE_JOB_SP_TENANT_ID
        )
        logger.setLevel(config.LOGGER_LEVEL)
        self.azure_valid_container_name = self.job_entity["name"].lower()

        token_thing = AzureTokenClass(azure_credentials.token)
        self.aci_client = ContainerInstanceManagementClient(token_thing, subscription_id=config.AZURE_JOB_SUBSCRIPTION)

    def start(self) -> str:
        logger.info(f"JobId; '{self.job_entity['_id']}': Starting Azure Container job.")

        logger.info(
            (
                f"Creating Azure container '{self.azure_valid_container_name}':",
                f"Image: '{self.job_entity.get('Image', 'None')}'",
                f"Command: '{self.job_entity.get('command', 'None')}'",
                f"Username: '{self.job_entity.get('cr-username', 'None')}'",
                "ComputePower: 'TODO'",
                "EnvironmentVariables: 'TODO'",
            )
        )

        # Configure the container
        env_vars = [EnvironmentVariable(name="NumWords", value="5")]
        compute_resources = ResourceRequests(memory_in_gb=1, cpu=1.0)
        container = Container(
            name=self.azure_valid_container_name,
            image=self.job_entity["image"],
            resources=ResourceRequirements(requests=compute_resources),
            command=self.job_entity.get("command"),
            environment_variables=env_vars,
        )

        # Configure the container group
        group = ContainerGroup(
            location="Norway East",
            containers=[container],
            os_type=OperatingSystemTypes.linux,
            restart_policy=ContainerGroupRestartPolicy.never,
        )

        # Create the container group
        result = self.aci_client.container_groups.begin_create_or_update(
            config.AZURE_JOB_RESOURCE_GROUP, self.azure_valid_container_name, group
        )

        return result.status()

    def remove(self) -> Tuple[JobStatus, str]:
        operation = self.aci_client.container_groups.begin_delete(
            config.AZURE_JOB_RESOURCE_GROUP, self.azure_valid_container_name
        )
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
        try:
            logs = self.aci_client.containers.list_logs(
                config.AZURE_JOB_RESOURCE_GROUP, self.azure_valid_container_name, self.azure_valid_container_name
            )
        except ResourceNotFoundError:
            raise JobNotFoundException(
                (
                    f"The container '{self.azure_valid_container_name}' does not exist.",
                    "Either it has not been created, or it's not ready to accept requests.",
                )
            )
        container_group = self.aci_client.container_groups.get(
            config.AZURE_JOB_RESOURCE_GROUP, self.azure_valid_container_name
        )
        status = container_group.containers[0].instance_view.current_state.state
        job_status = JobStatus.UNKNOWN
        if status == "Terminated":
            job_status = JobStatus.COMPLETED
        if status == "Waiting":
            job_status = JobStatus.STARTING
        return job_status, logs.content

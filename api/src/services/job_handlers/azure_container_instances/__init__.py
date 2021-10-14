import logging
from collections import namedtuple
from time import sleep
from typing import List, Tuple

from azure.core.exceptions import ResourceNotFoundError
from azure.mgmt.containerinstance import ContainerInstanceManagementClient
from azure.mgmt.containerinstance.models import (
    Container,
    ContainerGroup,
    ContainerGroupRestartPolicy,
    EnvironmentVariable,
    ImageRegistryCredential,
    OperatingSystemTypes,
    ResourceRequests,
    ResourceRequirements,
)
from msrestazure.azure_active_directory import ServicePrincipalCredentials

from config import config
from repository.repository_exceptions import JobNotFoundException
from services.job_handler_interface import JobStatus, ServiceJobHandlerInterface
from utils.logging import logger

AccessToken = namedtuple("AccessToken", ["token", "expires_on"])
logging.getLogger("azure").setLevel(logging.WARNING)

_SUPPORTED_JOB_TYPE = "DMT-Internal/DMT/AzureContainerInstanceJob"


class AzureTokenClass:  # TODO: Replace with one from the azure libraries.
    def __init__(self, token):
        self.token: AccessToken = AccessToken(token["access_token"], token["expires_on"])

    def get_token(self, *args, **kwargs):
        return self.token


class JobHandler(ServiceJobHandlerInterface):
    """
    Job handler plugin for Azure Container Instances.
    Support both executable jobs and job services
    """

    def teardown_service(self, service_id: str) -> str:
        raise NotImplementedError

    def setup_service(self, service_id: str) -> str:
        raise NotImplementedError

    def __init__(self, data_source: str, job_entity: dict, token: str):
        super().__init__(data_source, job_entity, token)
        logger.setLevel(logging.WARNING)  # I could not find the correctly named logger for this...
        azure_credentials = ServicePrincipalCredentials(
            config.AZURE_JOB_SP_CLIENT_ID, config.AZURE_JOB_SP_SECRET, tenant=config.AZURE_JOB_SP_TENANT_ID
        )
        logger.setLevel(config.LOGGER_LEVEL)
        self.azure_valid_container_name = self.job_entity["name"].lower()

        token_thing = AzureTokenClass(azure_credentials.token)
        self.aci_client = ContainerInstanceManagementClient(token_thing, subscription_id=config.AZURE_JOB_SUBSCRIPTION)

    def start(self) -> str:
        logger.info(
            f"JobName: '{self.job_entity.get('_id', self.job_entity.get('name'))}'."
            + " Starting Azure Container job..."
        )

        # Parse env vars
        env_vars: List[EnvironmentVariable] = []
        for env_string in self.job_entity.get("environmentVariables", []):
            key, value = env_string.split("=", 1)
            env_vars.append(EnvironmentVariable(name=key, value=value))

        logger.info(
            f"Creating Azure container '{self.azure_valid_container_name}':\n\t"
            + f"Image: '{self.job_entity.get('image', 'None')}'\n\t"
            + f"Command: {self.job_entity.get('command', 'None')}\n\t"
            + f"RegistryUsername: '{self.job_entity.get('cr-username', 'None')}'\n\t"
            + f"EnvironmentVariables: {[e.name for e in env_vars]}",
        )

        # Configure the container
        compute_resources = ResourceRequests(memory_in_gb=1, cpu=1.0)
        container = Container(
            name=self.azure_valid_container_name,
            image=self.job_entity["image"],
            resources=ResourceRequirements(requests=compute_resources),
            command=self.job_entity.get("command") + [f"--token={self.token}"],
            environment_variables=env_vars,
        )
        image_registry_credential = None
        if self.job_entity.get("cr-password"):  # If 'cr-password' is supplied, create and send registry credentials
            image_registry_credential = ImageRegistryCredential(
                server=self.job_entity["image"].split("/")[0],
                username=self.job_entity["cr-username"],
                password=self.job_entity["cr-password"],
            )

        # Configure the container group
        group = ContainerGroup(
            location=self.job_entity.get("azure-location", "Norway East"),
            containers=[container],
            os_type=OperatingSystemTypes.linux,
            restart_policy=ContainerGroupRestartPolicy.never,
            image_registry_credentials=[image_registry_credential],
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
            ).content
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
        if not logs:  # If no container logs, get the Container Instance events instead
            try:
                logs = container_group.containers[0].instance_view.events[-1].message
            except TypeError:
                pass

        job_status = JobStatus.UNKNOWN
        if status == "Terminated":
            job_status = JobStatus.COMPLETED
        if status == "Waiting":
            job_status = JobStatus.STARTING
        return job_status, logs

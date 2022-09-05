import json
import logging
import os
from collections import namedtuple
from pathlib import Path
from time import sleep
from typing import List, Tuple

from azure.core.exceptions import ResourceNotFoundError
from azure.identity import ClientSecretCredential
from azure.mgmt.containerinstance import ContainerInstanceManagementClient
from azure.mgmt.containerinstance.models import EnvironmentVariable

from config import config
from restful.exceptions import NotFoundException
from services.job_handler_interface import JobStatus, ServiceJobHandlerInterface
from services.job_handlers.omnia_classic_azure_container_instances.ARM_deployer import (
    Deployer,
)
from utils.logging import logger

AccessToken = namedtuple("AccessToken", ["token", "expires_on"])
logging.getLogger("azure.mgmt").setLevel(logging.WARNING)
logging.getLogger("azure.identity").setLevel(logging.WARNING)

_SUPPORTED_TYPE = "DMT-Internal/DMT/AzureContainerInstanceJobClassic"


def inject_environment_variables(template: dict, variables: List[EnvironmentVariable]) -> dict:
    template["resources"][1]["properties"]["containers"][0]["properties"]["environmentVariables"] = [
        {"name": e.name, "value": e.value} for e in variables
    ]
    return template


class JobHandler(ServiceJobHandlerInterface):
    """
    Job handler plugin for Azure Container Instances.
    Support both executable jobs and job services
    """

    def __init__(self, data_source: str, job_entity: dict, token: str):
        super().__init__(data_source, job_entity, token)
        logger.setLevel(logging.WARNING)  # I could not find the correctly named logger for this...
        azure_credentials = ClientSecretCredential(
            client_id=config.AZURE_JOB_SP_CLIENT_ID,
            client_secret=config.AZURE_JOB_SP_SECRET,
            tenant_id=config.AZURE_JOB_SP_TENANT_ID,
        )
        self.arm_deployer = Deployer(config.AZURE_JOB_SUBSCRIPTION, config.AZURE_JOB_RESOURCE_GROUP, azure_credentials)
        self.azure_valid_container_name = self.job_entity["name"].lower()
        self.aci_client = ContainerInstanceManagementClient(
            azure_credentials, subscription_id=config.AZURE_JOB_SUBSCRIPTION
        )
        logger.setLevel(config.LOGGER_LEVEL)

    def teardown_service(self, service_id: str) -> str:
        raise NotImplementedError

    def setup_service(self, service_id: str) -> str:
        raise NotImplementedError

    def start(self) -> str:
        logger.info(
            f"JobName: '{self.job_entity.get('_id', self.job_entity.get('name'))}'."
            + " Starting Azure Container job..."
        )

        # Add env-vars from deployment first
        env_vars: List[EnvironmentVariable] = [
            EnvironmentVariable(name=e, value=os.getenv(e)) for e in config.SCHEDULER_ENVS_TO_EXPORT if os.getenv(e)
        ]

        # Parse env-vars from job entity
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

        parameters = {
            "name": self.azure_valid_container_name,
            "image": self.job_entity["image"],
            "command": self.job_entity.get("command") + [f"--token={self.token}"],
            "cpuCores": 1,
            "memoryInGb": 2,
            "restartPolicy": "Never",
            "location": "norwayeast",
            "subnetId": self.job_entity.get("subnetId"),
            "logAnalyticsWorkspaceResourceId": self.job_entity.get("logAnalyticsWorkspaceResourceId"),
        }
        with open(f"{Path(__file__).parent}/OmniaClassicContainerInstance.json", "r") as template_file:
            template = json.load(template_file)

        template = inject_environment_variables(template, env_vars)

        logger.setLevel(logging.WARNING)  # I could not find the correctly named logger for this...
        result = self.arm_deployer.deploy(template, self.azure_valid_container_name, parameters)
        logger.setLevel(config.LOGGER_LEVEL)  # I could not find the correctly named logger for this...
        return result or "Ok"

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

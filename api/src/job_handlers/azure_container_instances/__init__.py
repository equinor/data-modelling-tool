import sys
import time
from typing import Tuple

from azure.common.client_factory import get_client_from_auth_file
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
from job_handlers.job_handler_interface import JobStatus, ServiceJobHandlerInterface
from utils.logging import logger


class HandleAzureContainerInstanceJobs(ServiceJobHandlerInterface):
    """
    Something
    """

    def teardown_service(self, service_id: str) -> str:
        pass

    def setup_service(self, service_id: str) -> str:
        pass

    def __init__(self, data_source: str, job_entity: dict):
        super().__init__(data_source, job_entity)
        self.aci_client = get_client_from_auth_file(ContainerInstanceManagementClient)

    def start(self) -> str:
        logger.info(f"JobId; '{self.job_entity['_id']}': Starting Azure Container job.")

        logger.info(
            f"Creating Azure container '{self.job_entity['name']}':",
            f"\tImage: '{self.job_entity.get('Image')}'",
            f"\tCommand: '{self.job_entity.get('command')}'",
            f"\tUsername: '{self.job_entity.get('cr-username')}'",
            "\tComputePower: 'TODO'",
            "\tEnvironmentVariables: 'TODO'",
        )

        # Configure the container
        env_vars = [EnvironmentVariable(name="NumWords", value="5")]
        compute_resources = ResourceRequests(memory_in_gb=1, cpu=1.0)
        container = Container(
            name=self.job_entity["name"],
            image=self.job_entity["image"],
            resources=ResourceRequirements(requests=compute_resources),
            command=self.job_entity.get("command"),
            environment_variables=env_vars,
        )

        # Configure the container group
        group = ContainerGroup(
            location="norway-east",
            containers=[container],
            os_type=OperatingSystemTypes.linux,
            restart_policy=ContainerGroupRestartPolicy.never,
        )

        # Create the container group
        result = self.aci_client.container_groups.create_or_update(
            config.AZURE_RESOURCE_GROUP, self.job_entity["name"], group
        )

        # Wait for the container create operation to complete. The operation is
        # "done" when the container group provisioning state is one of:
        # Succeeded, Canceled, Failed
        while result.done() is False:
            sys.stdout.write(".")
            time.sleep(1)

        # Get the provisioning state of the container group.
        container_group = self.aci_client.container_groups.get(config.AZURE_RESOURCE_GROUP, self.job_entity["name"])
        if str(container_group.provisioning_state).lower() == "succeeded":
            print(f"\nCreation of container group '{self.job_entity['name']}' succeeded.")
        else:
            print(
                f"\nCreation of container group '{self.job_entity['name']}' failed. Provisioning state",
                f"is: {container_group.provisioning_state}",
            )

        # Get the logs for the container
        logs = self.aci_client.container.list_logs(
            config.AZURE_RESOURCE_GROUP, self.job_entity["name"], self.job_entity["name"]
        )

        return logs

    def remove(self) -> str:
        # """Terminate and cleanup all job related resources"""
        # try:
        #     os.remove("./script.sh")
        # except FileNotFoundError:
        #     pass
        # return "removed script job ok"
        raise NotImplementedError

    def progress(self) -> Tuple[JobStatus, str]:
        """Poll progress from the job instance"""
        # return JobStatus.UNKNOWN, "Shell jobs does not support progress polling"
        raise NotImplementedError

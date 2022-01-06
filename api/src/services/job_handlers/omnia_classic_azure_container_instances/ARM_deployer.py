from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import DeploymentMode
from azure.mgmt.resource.resources.v2021_04_01.models import Deployment


class Deployer:
    def __init__(self, subscription_id, resource_group, credentials):
        self.subscription_id = subscription_id
        self.resource_group = resource_group
        self.credentials = credentials

        self.client = ResourceManagementClient(self.credentials, self.subscription_id)

    def deploy(self, template: dict, deployment_name: str, parameters: dict = None):
        deployment_properties = {
            "mode": DeploymentMode.incremental,
            "template": template,
            "parameters": {k: {"value": v} for k, v in parameters.items()},
        }

        deployment_async_operation = self.client.deployments.begin_create_or_update(
            self.resource_group, deployment_name, Deployment(properties=deployment_properties)
        )
        return deployment_async_operation.wait()

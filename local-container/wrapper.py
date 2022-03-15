import click
from dmss_api.apis import DefaultApi
import os
from uuid import uuid4
import json
class Settings():
    PUBLIC_DMSS_API: str = os.getenv("PUBLIC_DMSS_API", "http://dmss:5000")

settings = Settings()

dmss_api = DefaultApi()
dmss_api.api_client.configuration.host = settings.PUBLIC_DMSS_API

@click.group()
def cli():
    print("-------------------------------------------------------")
    print("| local wrapper |")
    print("------------------------------------------------------")


@cli.command()
@click.option("--target", help="Target directory to store result file", type=str, required=True)
@click.option("--result-link-target", help="dotted id to the operation entity's results list. Should be on the format: entityId.x.simulationConfigs.y.results", type=str, required=True)
@click.option("--token", help="A valid DMSS Access Token", type=str)
def upload(target: str, result_link_target: str,  token: str = None):
    # """Uploads the simulation results to $DMSS_HOST"""


    result_id = str(uuid4())
    example_result: dict = {
        "uid": result_id,
        "type": "system/SIMOS/NamedEntity",
        "name": f"resultFromLocalContainer_{result_id}",
        "description": "Example result from running a local container job"
    }
    dmss_api.api_client.default_headers["Authorization"] = "Bearer " + token
    data_source, directory = target.split("/", 1)
    print(f"*** ds is {data_source} and directory is {directory}")
    response = dmss_api.explorer_add_to_path(document=json.dumps(example_result), directory=directory, data_source_id=data_source)
    print(f"Result with is {response['uid']} was uploaded to {directory} ")

    reference_object = {"name": f"resultFromLocalContainer_{result_id}", "id": response['uid'], "type": "system/SIMOS/NamedEntity"}
    response = dmss_api.reference_insert(data_source_id=data_source, document_dotted_id=result_link_target, reference=reference_object)
    print(f"reference to result was added to the analysis ({result_link_target})")





if __name__ == "__main__":
    cli()
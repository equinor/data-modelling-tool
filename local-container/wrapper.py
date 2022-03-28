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
@click.option("--result-reference-location", help="dotted id to the operation entity's results list. Should be on the format: entityId.x.simulationConfigs.y.results", type=str, required=True)
@click.option("--token", help="A valid DMSS Access Token", type=str)
@click.option("--application-input", help="Json string with application input entity of type SIMAApplicationInput", type=str, required=True)
def get_and_upload_result(result_reference_location: str, application_input: dict, token: str = None):
    """
    Example function that will find the input entity inside the json string application-input, and upload it to the
    correct folder in dmss, and add a reference to this result to the analysis entity
    """
    new_id = str(uuid4())
    try:
        application_input = json.loads(application_input)
        entity_to_upload: dict = json.loads(application_input["input"])
        entity_to_upload["name"] = str(f"resultFromLocalContainer_{new_id}")
        entity_as_string: str = json.dumps(entity_to_upload)
    except Exception as error:
        print("An error occurred when extracting the entity to upload! Exiting.", error)
        return
    target = application_input["applicationConfig"]["resultPath"]
    if (target):
        dmss_api.api_client.default_headers["Authorization"] = "Bearer " + token
        data_source, directory = target.split("/", 1)
        response = dmss_api.explorer_add_to_path(document=entity_as_string, directory=directory, data_source_id=data_source)
        print(f"Result with id {response['uid']} was uploaded to {directory} ")

        reference_object = {"name": f"resultFromLocalContainer_{new_id}", "id": response['uid'], "type": entity_to_upload["type"]}
        dmss_api.reference_insert(data_source_id=data_source, document_dotted_id=result_reference_location, reference=reference_object)
        print(f"reference to result was added to the analysis ({result_reference_location})")
    else:
        print(f"No result path found in applicationInput... Exiting.")



if __name__ == "__main__":
    cli()
#! /usr/bin/env python3
import json
import os
import pprint
import time
import datetime
from pathlib import Path
from uuid import uuid4
import click
import requests
from dmss_api.apis import DefaultApi
from pydantic.env_settings import BaseSettings
from pydantic.fields import Field


class Settings(BaseSettings):
    PUBLIC_DMSS_API: str = Field("http://dmss:5000", env="PUBLIC_DMSS_API")
    SRE_HOME: str = os.getenv("SRE_HOME", "/var/opt/sima")
    STORAGE_DIR: str = f"{SRE_HOME}/storage"
    OUTPUT_DIR: str = f"{SRE_HOME}/storage/outputs"
    INPUT_DIR: str = f"{SRE_HOME}/storage/inputs"
    RESULT_FILE: str = f"{OUTPUT_DIR}/results_file.json"
    INPUT_FILE: str = f"{INPUT_DIR}/simulationConfig.json"


start_time = time.time()
pp = pprint.PrettyPrinter(indent=2, compact=True, width=119)
settings = Settings()

dmss_api = DefaultApi()
dmss_api.api_client.configuration.host = settings.PUBLIC_DMSS_API


def get_by_id(document_reference: str, token: str = "", depth: int = 1, attribute: str = ""):
    headers = {"Authorization": f"Bearer {token}"}
    params = {"depth": depth, "attribute": attribute}
    req = requests.get(
        f"{settings.PUBLIC_DMSS_API}/api/v1/documents/{document_reference}", params=params, headers=headers
    )
    req.raise_for_status()

    return req.json()


def download_blob_by_id(document_reference: str, target_path: str, token: str = ""):
    headers = {"Authorization": f"Bearer {token}"}
    req = requests.get(
        f"{settings.PUBLIC_DMSS_API}/api/v1/blobs/{document_reference}", headers=headers
    )
    req.raise_for_status()
    os.makedirs(Path(target_path).parent, exist_ok=True)
    with open(target_path, "wb") as out_file:
        out_file.write(req.content)


@click.group()
def cli():
    print("-------------------------------------------------------")
    print("| Data Modelling Tool SIMA Runtime Engine Job Wrapper |")
    print("------------------------------------------------------")


@cli.result_callback()
def after_commands(*args, **kwargs):
    run_time = time.time() - start_time
    milliseconds = int(round(run_time * 1000))
    print("------------------------------------------------------")
    print(f"|                 Done! (in {milliseconds}ms)                    |")
    print("------------------------------------------------------")


@cli.command()
@click.option("--stask", help="DataSource and UUID to the stask entity in DMSS (DS/UUID)", type=str,
              required=True)
@click.option("--task", help="Name of the task defined in the stask to run", type=str, required=True)
@click.option("--workflow", help="Name of the workflow defined in the task to run", type=str, required=True)
@click.option("--compute-service-cfg",
              help="DataSource and UUID to the SIMA compute service config entity in DMSS (DS/UUID)", type=str)
@click.option("--remote-run", help="Run SIMA with remote-run", is_flag=True, type=bool, default=False)
@click.option("--input", help="DataSource and UUID to the input entity in DMSS (DS/UUID)", type=str)
@click.option("--token", help="A valid DMSS Access Token", type=str)
def run(
        stask: str,
        task: str,
        workflow: str,
        compute_service_cfg: str = None,
        remote_run: bool = False,
        input: str = None,
        token: str = None
):
    """Prepares the local environment with the given stask and workflow configuration"""
    print(f"Received parameters: \n\tstask='{stask}'\n\tworkflow='{task}'"
          f"\n\tcompute-service-config='{compute_service_cfg}'\n\tremote-run='{remote_run}'\n\tinput='{input}'\n")
    if remote_run and not compute_service_cfg:
        # remote-run requires a compute service config
        raise ValueError(f"Missing required parameter 'compute-service-cfg':"
                         f"Running with 'remote-run' requires a 'compute-service-cfg'. Please provide the SIMA compute service.")

    print(f"Fetching Stask '{stask}'...")
    download_blob_by_id(stask, f"{settings.SRE_HOME}/workflow.stask", token)
    print(f"Wrote stask blob to '{settings.SRE_HOME}/workflow.stask'")

    if compute_service_cfg:
        # Create the SIMA compute service config file
        print(f"Fetching SIMA compute service config '{compute_service_cfg}'...\n")
        download_blob_by_id(compute_service_cfg, f"{settings.SRE_HOME}/compute.yml", token)
        print(f"\nWrote compute service config blob to '{settings.SRE_HOME}/compute.yml'")

    # Ensure that the "storage" directory is present
    os.makedirs(settings.INPUT_DIR, exist_ok=True)
    if input:
        # Create the input (SIMA-internal simulationConfig.json) file
        print(f"Fetching input '{input}'...")
        input_entity = get_by_id(input, depth=1, token=token)
        pp.pprint(input_entity)

        # Create the simulationConfig.json file (generic Stask entity, not related to DMT blueprint)
        with open(f"{settings.INPUT_FILE}", "w") as simulation_config_file:
            print(f"Writing input to '{settings.INPUT_FILE}'...")
            simulation_config_file.write(json.dumps(input_entity))

    # Create the commands file (test data: task=WorkflowTask workflow: wave_180 & wave_90
    with open(f"{settings.SRE_HOME}/commands.txt", "w") as commands_file:
        run_cmd = 'remote-run' if remote_run else 'run'
        run_cmd_kwargs = f"task={task} workflow={workflow} "  # generic to both run_cmd "run" and "remote-run"
        if remote_run:  # specific arguments for remote-run
            run_cmd_kwargs += f"distributed=false recursive=true config={settings.SRE_HOME}/compute.yml "
            run_cmd_kwargs += f"computeService=scs wait=true download=true"
        commands_file.write(
            f"import file={settings.SRE_HOME}/workflow.stask\n" +
            f"save\n"
            f"{run_cmd} {run_cmd_kwargs} \n"
        )
    with open(f"{settings.SRE_HOME}/commands.txt", "r") as commands_file:
        print("Wrote stask command file:")
        print(f"--- {settings.SRE_HOME}/commands.txt ---")
        print(commands_file.read())
        print("---")
    print(f"DMT SRE Wrapper Successfully prepared the SRE Environment")


@cli.command()
@click.option("--result-reference-location", help="dotted id to the operation entity's results list. Should be on the format: entityId.x.simulationConfigs.y.results", type=str, required=True)
@click.option("--token", help="A valid DMSS Access Token", type=str)
@click.option("--application-input", help="Json string with application input entity of type SIMAApplicationInput", type=str, required=True)
def get_and_upload_result(result_reference_location: str, application_input: dict, token: str = None):
    """
    Example function that will find the input entity inside the json string application-input, and upload it to the
    correct folder in dmss, and add a reference to this result to the analysis entity
    """
    application_input = application_input.replace("%20", " ")
    new_id = str(uuid4())
    try:
        application_input = json.loads(application_input)
        entity_to_upload: dict = json.loads(application_input["input"])
        entity_to_upload["name"] = str(f"resultFromLocalContainer_{new_id}")
        entity_as_string: str = json.dumps(entity_to_upload)
    except Exception as error:
        print("An error occurred when extracting the entity to upload! Exiting.", error)
        return
    target = application_input["resultPath"]
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

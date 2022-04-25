#! /usr/bin/env python3
import json
import os
import pprint
import time
from datetime import datetime
from pathlib import Path

import click
import requests
from dmss_api.apis import DefaultApi
from pydantic.env_settings import BaseSettings
from pydantic.fields import Field


class Settings(BaseSettings):
    PUBLIC_DMSS_API: str = Field("http://dmss:5000", env="PUBLIC_DMSS_API")
    DMSS_TOKEN: str = Field(None, env="DMSS_TOKEN")
    SRE_HOME: str = os.getenv("SRE_HOME", "/var/opt/sima")
    STORAGE_DIR: str = f"{SRE_HOME}/storage"
    OUTPUT_DIR: str = f"{SRE_HOME}/storage/outputs"
    INPUT_DIR: str = f"{SRE_HOME}/storage/inputs"
    RESULT_FILE: str = f"{OUTPUT_DIR}/results_file.json"
    SIMA_INPUT_FILE: str = f"{INPUT_DIR}/simulationConfig.json"  # The entity fed to SIMA
    INPUT_ENTITY_FILE: str = f"/tmp/input-entity.json"  # The entity with the configuration for the SIMA run


start_time = time.time()
pp = pprint.PrettyPrinter(indent=2, compact=True, width=119)
settings = Settings()

dmss_api = DefaultApi()
dmss_api.api_client.configuration.host = settings.PUBLIC_DMSS_API


def get_by_id(document_reference: str, depth: int = 1, attribute: str = ""):
    headers = {"Access-Key": settings.DMSS_TOKEN}
    params = {"depth": depth, "attribute": attribute}
    req = requests.get(
        f"{settings.PUBLIC_DMSS_API}/api/v1/documents/{document_reference}", params=params, headers=headers
    )
    req.raise_for_status()

    return req.json()


def download_blob_by_id(document_reference: str, target_path: str):
    headers = {"Access-Key": settings.DMSS_TOKEN}
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
@click.option("--input-id", help="DataSource and UUID to the input entity in DMSS (DS/UUID)", type=str)
def run(input_id: str = None):
    input_entity = get_by_id(input_id, depth=99)
    # Assume the stask blob is stored in same DS. As we don't support cross DS references...
    data_souce = input_id.split("/", 1)[0]
    stask_id = f"{data_souce}/{input_entity['stask']['blob']['_blob_id']}"
    task = input_entity["workflowTask"]
    workflow = input_entity["workflow"]
    compute_service_cfg = input_entity.get("compute_service_cfg")
    remote_run = input_entity.get("remote_run", False)
    sima_input = input_entity["input"]
    pp.pprint(sima_input)

    # Save it for later use in the "upload" command
    with open(settings.INPUT_ENTITY_FILE, "w") as input_entity_file:
        input_entity_file.write(json.dumps(input_entity))

    # Prepares the local environment with the given stask and workflow configuration
    print(f"Received parameters: \n\tstask='{stask_id}'\n\tworkflow='{task}'"
          f"\n\tcompute-service-config='{compute_service_cfg}'\n\tremote-run='{remote_run}'\n")
    if remote_run and not compute_service_cfg:
        # remote-run requires a compute service config
        raise ValueError(f"Missing required parameter 'compute-service-cfg':"
                         f"Running with 'remote-run' requires a 'compute-service-cfg'. Please provide the SIMA compute service.")

    print(f"Fetching Stask '{stask_id}'...")
    download_blob_by_id(stask_id, f"{settings.SRE_HOME}/workflow.stask")
    print(f"Wrote stask blob to '{settings.SRE_HOME}/workflow.stask'")

    if compute_service_cfg:
        # Create the SIMA compute service config file
        print(f"Fetching SIMA compute service config '{compute_service_cfg}'...\n")
        download_blob_by_id(compute_service_cfg, f"{settings.SRE_HOME}/compute.yml")
        print(f"\nWrote compute service config blob to '{settings.SRE_HOME}/compute.yml'")

    # Ensure that the "storage" directory is present
    os.makedirs(settings.INPUT_DIR, exist_ok=True)

    # Create the simulationConfig.json file (generic Stask entity, not related to DMT blueprint)
    with open(f"{settings.SIMA_INPUT_FILE}", "w") as simulation_config_file:
        print(f"Writing input to '{settings.SIMA_INPUT_FILE}'...")
        simulation_config_file.write(json.dumps(sima_input))

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
@click.option("--reference-target", help="Dotted id to an analysis entity's job result. Should be on the format: entityId.jobs.*index*.result.", type=str, required=True)
def upload_result(reference_target: str):
    """
    Uploads the result to the folder given in the input-entity, and add a reference to this result to the analysis entity
    :param reference_target: a dotted id to specify where to insert result reference
    """
    with open(settings.INPUT_ENTITY_FILE, "r") as input_entity_file:
        input_entity: dict = json.loads(input_entity_file.read())

    target_data_source, target_directory = input_entity["resultPath"].split("/", 1)

    with open(settings.RESULT_FILE, "r") as file:
        result_entity = json.loads(file.read())
        timestamp = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")

        result_entity["name"] = result_entity["name"] + "-" + timestamp
        dmss_api.api_client.default_headers["Authorization"] = "Access-Key " + settings.DMSS_TOKEN
        response = dmss_api.explorer_add_to_path(document=json.dumps(result_entity),
                                                 directory=target_directory,
                                                 data_source_id=target_data_source)
        print(f"Result file uploaded successfully to '{target_data_source}/{target_directory}' -- id: {response['uid']}")

    reference_object = {
        "name": result_entity.get("name", "noname"),
        "id": response['uid'],
        "type": result_entity["type"]
    }

    dmss_api.reference_insert(data_source_id=target_data_source, document_dotted_id=reference_target,
                              reference=reference_object)
    print(f"Reference to result was added to {reference_target}")


if __name__ == "__main__":
    cli()

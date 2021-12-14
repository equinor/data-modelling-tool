#! /usr/bin/env python3
import json
import os
import pprint
import time

import click
import requests
from dmss_api.apis import DefaultApi
from pydantic.env_settings import BaseSettings
from pydantic.fields import Field
from typing import Tuple


class Settings(BaseSettings):
    PUBLIC_DMSS_API: str = Field("http://localhost:5000", env="PUBLIC_DMSS_API")
    SRE_HOME: str = os.getenv("SRE_HOME", "/var/opt/sima")
    WORKSPACE_DIR: str = f"{SRE_HOME}/workspace"
    STORAGE_DIR: str = f"{WORKSPACE_DIR}/storage"
    RESULT_FILE: str = f"{STORAGE_DIR}/results_file.json"


start_time = time.time()
pp = pprint.PrettyPrinter(indent=2, compact=True, width=119)
settings = Settings()

dmss_api = DefaultApi()
dmss_api.api_client.configuration.host = settings.PUBLIC_DMSS_API


def get_by_id(data_source_id: str, document_id: str, token: str = "", depth: int = 1, attribute: str = ""):
    headers = {"Authorization": f"Bearer {token}"}
    params = {"depth": depth, "attribute": attribute}
    req = requests.get(
        f"{settings.PUBLIC_DMSS_API}/api/v1/documents/{data_source_id}/{document_id}", params=params, headers=headers
    )
    req.raise_for_status()

    return req.json()


def split_absolute_ref(abs_ref: str) -> Tuple[str, str]:
    try:
        data_source_id, entity_id = abs_ref.split("/", 1)
        return data_source_id, entity_id
    except ValueError:
        raise ValueError("Invalid reference. Should be in format 'DataSourceId/UUID'")


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

    dmss_api.api_client.configuration.access_token = token

    stask_data_source_id, stask_blob_id = split_absolute_ref(stask)

    # Create the Stask file
    os.makedirs(settings.SRE_HOME, exist_ok=True)
    with open(f"{settings.SRE_HOME}/workflow.stask", "wb") as stask_file:
        print(f"Fetching Stask '{stask}'...")
        response = dmss_api.blob_get_by_id(stask_data_source_id, stask_blob_id)
        print(f"Writing stask blob to '{settings.SRE_HOME}/workflow.stask'...")
        stask_file.write(response.read())

    if compute_service_cfg:
        # Create the SIMA compute service config file
        print(f"Fetching SIMA compute service config '{compute_service_cfg}'...\n")
        try:
            compute_cfg_data_source_id, compute_cfg_entity_id = compute_service_cfg.split("/", 1)
        except ValueError:
            raise ValueError("Invalid compute-service-cfg id. Should be in format 'DataSourceId/UUID'")

        # Create the compute.yml file
        with open(f"{settings.SRE_HOME}/compute.yml", "wb") as compute_file:
            compute_cfg_blob = dmss_api.blob_get_by_id(compute_cfg_data_source_id, compute_cfg_entity_id)
            print(f"\nWriting compute service config blob to '{settings.SRE_HOME}/compute.yml'")
            compute_file.write(compute_cfg_blob.read())

    # Ensure that the "storage" directory is present
    os.makedirs(settings.STORAGE_DIR, exist_ok=True)
    if input:
        # Create the input (SIMA-internal simulationConfig.json) file
        print(f"Fetching input '{input}'...")
        input_data_source_id, input_entity_id = split_absolute_ref(input)
        input_entity = get_by_id(input_data_source_id, input_entity_id, depth=1, token=token)

        pp.pprint(input_entity)

        # Create the simulationConfig.json file (generic Stask entity, not related to DMT blueprint)
        with open(f"{settings.STORAGE_DIR}/simulationConfig.json", "w") as simulation_config_file:
            print(f"Writing input to '{settings.STORAGE_DIR}/simulationConfig.json'...")
            simulation_config_file.write(json.dumps(input_entity))

    # Create the commands file (test data: task=WorkflowTask workflow: wave_180 & wave_90
    os.makedirs(settings.WORKSPACE_DIR, exist_ok=True)
    with open(f"{settings.WORKSPACE_DIR}/commands.txt", "w") as commands_file:
        run_cmd = 'remote-run' if remote_run else 'run'
        run_cmd_kwargs = f"task={task} workflow={workflow} "  # generic to both run_cmd "run" and "remote-run"
        if remote_run:  # specific arguments for remote-run
            run_cmd_kwargs += f"distributed=false recursive=true config={settings.SRE_HOME}/compute.yml "
            run_cmd_kwargs += f"computeService=scs wait=true download=true"
        commands_file.write(
            f"import file={settings.SRE_HOME}/workflow.stask\n" +
            f"save\n" +
            f"{run_cmd} {run_cmd_kwargs} \n"
        )
    with open(f"{settings.WORKSPACE_DIR}/commands.txt", "r") as commands_file:
        print("Wrote stask command file:")
        print(f"--- {settings.WORKSPACE_DIR}/commands.txt")
        print(commands_file.read())
        print("---")
    print(f"DMT SRE Wrapper Successfully prepared the SRE Environment")


@cli.command()
@click.option("--target", help="Target directory to store result file", type=str, required=True)
@click.option("--source", help="Path to SIMA generated result file", type=str, default=settings.RESULT_FILE)
@click.option("--token", help="A valid DMSS Access Token", type=str)
def upload(target: str, source: str = settings.RESULT_FILE, token: str = None):
    """Uploads the simulation results to $DMSS_HOST"""
    print(f"Uploading result entity from SIMA run  --  local:{source} --> DMSS:{target}")
    dmss_api.api_client.configuration.access_token = token
    data_source, directory = target.split("/", 1)
    with open(source, "r") as file:
        response = dmss_api.explorer_add_to_path(document=file.read(), directory=directory, data_source_id=data_source)
        print(f"Result file uploaded successfully -- id: {response['uid']}")


if __name__ == "__main__":
    cli()

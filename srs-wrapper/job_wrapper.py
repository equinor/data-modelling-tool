#! /usr/bin/env python3
import json
import os
import pprint
import time

import click
from dmss_api.apis import DefaultApi
from pydantic.env_settings import BaseSettings
from pydantic.fields import Field

pp = pprint.PrettyPrinter(indent=2, compact=True, width=119)


class Settings(BaseSettings):
    AUTH_ENABLED: bool = Field(False, env="AUTH_ENABLED")
    DMSS_TOKEN: str = Field("some_token", env="DMSS_TOKEN")
    DMSS_HOST: str = Field("http://localhost:5000", env="DMSS_HOST")
    SRS_HOME: str = "/var/opt/sima"
    RESULT_FILE: str = "/var/opt/sima/workspace/result.json"


settings = Settings()

dmss_api = DefaultApi()
dmss_api.api_client.configuration.host = settings.DMSS_HOST

start_time = time.time()


@click.group()
def cli():
    print("-------------------------------------------------------")
    print("| Data Modelling Tool SIMA Runtime Service Job Wrapper |")
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
@click.option("--workflow", help="Name of the workflow defined in the stask to run", type=str, required=True)
@click.option("--input", help="DataSource and UUID to the input entity in DMSS (DS/UUID)", type=str)
@click.option("--token", help="A valid DMSS Access Token", type=str)
def run(stask: str, workflow: str = None, input: str = None, token: str = None):
    """Prepares the local environment with the given stask and workflow configuration"""
    print(f"Recived parameters: stask='{stask}', workflow='{workflow}', input='{input}'")
    print(f"Fetching Stask '{stask}'...\n")
    try:
        data_source_id, entity_id = stask.split("/", 1)
    except ValueError:
        raise ValueError("Invalid stask id. Should be on format 'DataSourceId/UUID'")

    dmss_api.api_client.configuration.access_token = token
    stask_entity = dmss_api.document_get_by_id(data_source_id, entity_id)["document"]
    print("Stask entity:")
    pp.pprint(stask_entity)
    task_name = stask_entity["workflowTask"]
    blob_id = stask_entity["blob"]["_blob_id"]

    # Create the Stask file
    os.makedirs(settings.SRS_HOME, exist_ok=True)
    with open(f"{settings.SRS_HOME}/workflow.stask", "wb") as stask_file:
        response = dmss_api.blob_get_by_id(data_source_id, blob_id)
        print(f"\nWriting stask blob to '{settings.SRS_HOME}/workflow.stask'")
        stask_file.write(response.read())

    # Create the commands file (test data: task=WorkflowTask workflow: wave_180 & wave_90
    os.makedirs("/var/opt/sima/workspace", exist_ok=True)
    with open("/var/opt/sima/workspace/commands.txt", "w") as commands_file:
        commands_file.write(
            f"import file={settings.SRS_HOME}/workflow.stask\n" +
            f"run task={task_name} workflow={workflow}\n"
        )
    with open("/var/opt/sima/workspace/commands.txt", "r") as commands_file:
        print(f"Wrote stask command file:\n")
        print("--- /var/opt/sima/workspace/commands.txt")
        print(commands_file.read())
        print("---")
    print(f"DMT SRS Wrapper Successfully prepared the SRS Environment")

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
        # TODO: Just load the dmt valid result entity directly
        result_document = {
            "type": "DemoDS/DMT-demo/SIMARuntimeService/TextResult",
            "name": "Srs-WritebackTest",
            "result": file.read()
        }
        response = dmss_api.explorer_add_to_path(document=json.dumps(result_document), directory=directory,
                                                 data_source_id=data_source)
        print(f"Result file uploaded successfully -- id: {response['uid']}")


if __name__ == "__main__":
    cli()

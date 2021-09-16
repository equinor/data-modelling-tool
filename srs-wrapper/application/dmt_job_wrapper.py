#! /usr/bin/env python3
import os
import time

import click
from dmss_api.apis import DefaultApi
from pydantic.env_settings import BaseSettings
from pydantic.fields import Field


class Settings(BaseSettings):
    ENVIRONMENT: str = Field("local", env="ENVIRONMENT")
    AUTH_ENABLED: bool = Field(False, env="AUTH_ENABLED")
    DMSS_TOKEN: str = Field("some_token", env="DMSS_TOKEN")
    DMSS_HOST: str = Field("localhost", env="DMSS_HOST")
    DMSS_PORT: str = Field("8000", env="DMSS_PORT")
    DMSS_SCHEMA: str = "http" if ENVIRONMENT != "production" else "https"
    SRS_HOME: str = "/var/opt/sima"
    SRS_STASK: str = Field("", env="SRS_STASK")


settings = Settings()

dmss_api = DefaultApi()
dmss_api.api_client.configuration.host = f"{settings.DMSS_SCHEMA}://{settings.DMSS_HOST}:{settings.DMSS_PORT}"

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
    print(f"DMT SRS Wrapper Successfully prepaired the SRS Environment")
    print(f"Total time: {milliseconds}ms")
    print("-------------------------------------------------------")
    print("|                      Done!                           |")
    print("------------------------------------------------------")


@cli.command()
@click.option("--stask-id", "-t", default=settings.SRS_STASK,
              help="DataSource and UUID to the stask blob in DMSS (DS/UUID)", type=str)
def run(stask_id: str):
    print(f"Fetching Stask with DMSS-id '{stask_id}'")

    if not stask_id:
        raise ValueError("No stask value provided. Either set environment ",
                         "variable 'SRR_STASK', or use the '--stask-id' CLI parameter")

    try:
        data_source_id, blob_id = stask_id.split("/", 1)
    except ValueError:
        raise ValueError("Invalid stask id. Should be on format 'DataSourceId/BlobUUID'")

    os.makedirs(settings.SRS_HOME, exist_ok=True)

    with open(f"{settings.SRS_HOME}/workflow.stask", "wb") as stask_file:
        response = dmss_api.blob_get_by_id(data_source_id, blob_id)
        print(f"Writing to '{settings.SRS_HOME}/workflow.stask'")
        stask_file.write(response.read())


if __name__ == "__main__":
    cli()

import io
import json
import os
import traceback
from pathlib import Path
from zipfile import ZipFile

import click
import emoji
from dmss_api.exceptions import ApiException
from flask import Flask
from services.job_service import JobService

from config import config
from controllers import blueprints, entity, index, system, jobs
from services.dmss import dmss_api
from use_case.import_package import import_package_tree, package_tree_from_zip
from utils.create_application_utils import zip_all
from utils.logging import logger


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    app.register_blueprint(index.blueprint)
    app.register_blueprint(system.blueprint)
    app.register_blueprint(blueprints.blueprint)
    app.register_blueprint(entity.blueprint)
    app.register_blueprint(jobs.blueprint)
    app.secret_key = os.urandom(64)
    return app


try:
    with open("./version.txt") as version_file:
        print(f"VERSION: {version_file.read()}")
except FileNotFoundError:
    pass

app = create_app(config)


# Using this decorator is needed so we don't get more than
# one instance of the job scheduler running the same jobs multiple times.
@app.before_first_request
def load_cron_jobs():
    if config.JOB_SERVICE_ENABLED == 1:
        JobService().load_cron_jobs()


@click.group()
@click.option("--token", default="no-token", type=str)
def cli(token: str):
    dmss_api.api_client.default_headers["Authorization"] = "Bearer " + token
    pass


@cli.command()
def remove_application():
    logger.info("-------------- REMOVING OLD APPLICATION FILES ----------------")
    logger.debug(("Removing application specific files from" f" the configured DMSS instance; {config.DMSS_API}"))
    for app_name, settings in config.APP_SETTINGS.items():
        for package in settings.get("packages", []):
            data_source_alias, folder = package.split("/", 1)
            actual_data_source = next(
                (v for k, v in settings["data_source_aliases"].items() if k == data_source_alias), data_source_alias
            )
            logger.info(f"Deleting package '{actual_data_source}/{folder}' from DMSS...")
            try:
                dmss_api.explorer_remove_by_path(actual_data_source, {"directory": folder})
            except ApiException as error:
                if error.status == 404:
                    logger.warning(emoji.emojize(f":warning: Could not find '{folder}' in DMSS..."))
                    pass
                else:
                    raise error
    logger.info("-------------- DONE ----------------")


@cli.command()
@click.argument("src")
@click.argument("dst")
def reset_package(src, dst):
    logger.info(f"-------------- RESETTING PACKAGE {dst} ----------------")
    if not Path(src).is_dir():
        raise ValueError(f"'{src}' is not a directory. Current working directory is '{os.getcwd()}'")
    data_source, folder = dst.split("/", 1)
    try:
        dmss_api.explorer_remove_by_path(data_source, {"directory": folder})
    except ApiException as error:
        if error.status == 404:
            logger.warning(emoji.emojize(f":warning: Could not find '{folder}' in DMSS..."))
            pass
        else:
            raise error

    memory_file = io.BytesIO()
    with ZipFile(memory_file, mode="w") as zip_file:
        zip_all(
            zip_file,
            src,
            real_name=folder,  # Use target package name as name in zip archive
            write_folder=True,
        )
    memory_file.seek(0)

    root_package = package_tree_from_zip(data_source, folder, memory_file)
    import_package_tree(root_package, data_source)

    logger.info("-------------- DONE ----------------")


@cli.command()
def init_application():
    logger.info("-------------- IMPORTING PACKAGES ----------------")
    for app_name, settings in config.APP_SETTINGS.items():
        app_directory_name = Path(settings["file_loc"]).parent.name
        logger.debug(f"Importing data for app '{app_name}'")
        logger.debug("_____ importing data sources _____")
        ds_dir = f"{config.APPLICATION_HOME}/{app_directory_name}/{config.APPS_DATASOURCE_SUBFOLDER}/"
        data_sources_to_import = []
        try:
            data_sources_to_import = os.listdir(ds_dir)
        except FileNotFoundError:
            logger.warning(
                emoji.emojize(f":warning: No 'data_source' directory was found under '{ds_dir}'. Nothing to import...")
            )

        for filename in data_sources_to_import:
            with open(f"{ds_dir}{filename}") as file:
                document = json.load(file)
                try:
                    dmss_api.data_source_save(document["name"], data_source_request=document)
                    logger.info(f"Added data source '{document['name']}'")
                except (ApiException, KeyError) as error:
                    if error.status == 400:
                        logger.warning(
                            emoji.emojize(
                                f":warning: Could not import data source '{filename}'. "
                                "A data source with that name already exists"
                            )
                        )
                    else:
                        raise ImportError(f"Failed to import data source '{filename}': {error}")

        logger.debug("_____ DONE importing data sources _____")

        logger.debug(f"_____ importing blueprints and entities {tuple(settings.get('packages', []))}_____")
        for package in settings.get("packages", []):
            data_source_alias, folder = package.split("/", 1)
            actual_data_source = settings["data_source_aliases"].get(data_source_alias, data_source_alias)
            memory_file = io.BytesIO()
            with ZipFile(memory_file, mode="w") as zip_file:
                zip_all(
                    zip_file,
                    f"{config.APPLICATION_HOME}/{app_directory_name}/data/{data_source_alias}/{folder}",
                    write_folder=True,
                )
            memory_file.seek(0)

            try:
                root_package = package_tree_from_zip(actual_data_source, folder, memory_file)
                # Import the package into the data source defined in _aliases_, or using the data_source folder name
                import_package_tree(root_package, actual_data_source)
            except Exception as error:
                traceback.print_exc()
                raise Exception(f"Something went wrong trying to upload the package '{package}' to DMSS; {error}")
        logger.debug(f"_____ DONE importing blueprints and entities {tuple(settings.get('packages', []))}_____")
    logger.info(emoji.emojize("-------------- DONE ---------------- :check_mark_button:"))


@cli.command()
@click.pass_context
def reset_app(context):
    context.invoke(remove_application)
    context.invoke(init_application)
    config.load_app_settings()


if __name__ == "__main__":
    cli()

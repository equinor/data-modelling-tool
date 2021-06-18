import io
import json
import os
from pathlib import Path
from zipfile import ZipFile

import click
import emoji
from dmss_api.exceptions import ApiException
from flask import Flask

from config import config
from controllers import blueprints, entity, explorer, index, system
from services.dmss import dmss_api
from use_case.import_package import import_package_tree, package_tree_from_zip
from utils.create_application_utils import zip_all
from utils.logging import logger


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    app.register_blueprint(explorer.blueprint)
    app.register_blueprint(index.blueprint)
    app.register_blueprint(system.blueprint)
    app.register_blueprint(blueprints.blueprint)
    app.register_blueprint(entity.blueprint)
    app.secret_key = os.urandom(64)
    return app


app = create_app(config)


@click.group()
def cli():
    pass


@cli.command()
def remove_application():
    logger.info("-------------- REMOVING OLD APPLICATION FILES ----------------")
    logger.debug(
        (
            "Removing application specific files from"
            f" the configured DMSS instance; {config.DMSS_HOST}:{config.DMSS_PORT}"
        )
    )
    for app_name, settings in config.APP_SETTINGS.items():
        for folder in settings["packages"]:
            logger.info(f"Deleting package '{folder}' from DMSS...")
            data_source, folder = folder.split("/", 1)
            try:
                dmss_api.explorer_remove_by_path(data_source, {"directory": folder})
            except ApiException as error:
                if error.status == 404:
                    logger.warning(emoji.emojize(f":warning: Could not find '{folder}' in DMSS..."))
                    pass
                else:
                    raise error
    logger.info("-------------- DONE ----------------")


@cli.command()
def init_application():
    logger.info("-------------- IMPORTING PACKAGES ----------------")
    for app_name, settings in config.APP_SETTINGS.items():
        logger.debug(f"Importing data for app '{app_name}'")
        logger.debug("_____ importing data sources _____")
        ds_dir = f"{config.APPLICATION_HOME}/{app_name}/{config.APPS_DATASOURCE_SUBFOLDER}/"
        data_sources_to_import = []
        try:
            data_sources_to_import = os.listdir(ds_dir)
        except FileNotFoundError:
            logger.warning(emoji.emojize(f":warning: No 'data_source' directory was found under '{ds_dir}'. Nothing to import..."))

        for filename in data_sources_to_import:
            with open(f"{ds_dir}{filename}") as file:
                document = json.load(file)
                try:
                    dmss_api.data_source_save(document["name"], data_source_request=document)
                    logger.info(f"Added data source '{document['name']}'")
                except (ApiException, KeyError) as error:
                    if error.status == 400:
                        logger.warning(
                            emoji.emojize(f":warning: Could not import data source '{filename}'. "
                            "A data source with that name already exists")
                        )
                    else:
                        raise ImportError(f"Failed to import data source '{filename}': {error}")

        logger.debug("_____ DONE importing data sources _____")

        logger.debug(f"_____ importing blueprints and entities {tuple(settings['packages'])}_____")
        for folder in settings["packages"]:
            data_source, folder = folder.split("/", 1)
            try:
                memory_file = io.BytesIO()
                with ZipFile(memory_file, mode="w") as zip_file:
                    zip_all(
                        zip_file,
                        f"{config.APPLICATION_HOME}/{app_name}/data/{data_source}/{folder}",
                        write_folder=False,
                    )
                memory_file.seek(0)

                root_package = package_tree_from_zip(data_source, folder, memory_file)
            except Exception as error:
                raise Exception(
                    f"Something went wrong trying to load the root package '{data_source}/{folder}' ; {error}"
                )
            try:
                import_package_tree(root_package, data_source)
            except Exception as error:
                raise Exception(
                    f"Something went wrong trying to upload the package ''{data_source}/{folder}'' to DMSS; {error}"
                )
        logger.debug(f"_____ DONE importing blueprints and entities {tuple(settings['packages'])}_____")

    logger.debug("_____ importing blobs _____")
    # TODO:  This is a temporary fix for import of blob data.
    #  Should update "import_package_tree()" to work with blob data
    try:
        for blob_container in config.IMPORT_BLOBS:
            with open(f"{config.APPLICATION_HOME}/{blob_container}", "r") as file:
                doc = json.load(file)
            blob_ref = doc.get("blob_reference")
            if blob_ref:
                root_package = "/".join(blob_container.split("/")[:4])
                blob_relative_path = blob_ref.split(":")[1]
                blob_path = f"{config.APPLICATION_HOME}/{root_package}{blob_relative_path}"

                with open(blob_path, "rb") as file:
                    doc["blob_reference"] = Path(file.name).name
                    parent_directory = str(Path(blob_container).parent)
                    target_directory = "/".join(parent_directory.split("/")[3:])
                    data_source = blob_container.split("/")[2]
                    dmss_api.explorer_add_to_path(
                        data_source,
                        document=json.dumps(doc),
                        directory="/content/".join(target_directory.split("/")) + "/content",
                        files=[file],
                    )
    except Exception as e:
        logger.debug(e)
        pass
    logger.debug("_____  DONE importing blobs _____")

    logger.info(emoji.emojize("-------------- DONE ---------------- :check_mark_button:"))


@cli.command()
@click.pass_context
def reset_app(context):
    context.invoke(remove_application)
    context.invoke(init_application)
    config.load_app_settings()


if __name__ == "__main__":
    cli()

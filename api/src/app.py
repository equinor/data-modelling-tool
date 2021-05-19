import json
import os

from dmss_api.exceptions import ApiException
from flask import Flask

from config import Config
from controllers import blueprints, entity, explorer, index, system
from services.dmss import dmss_api
from utils.logging import logger
from utils.package_import import import_package


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


app = create_app(Config)


@app.cli.command()
def remove_application():
    try:
        logger.info("-------------- REMOVING DMT FILES ----------------")
        logger.info(
            (
                "Removing DMT application specific files from"
                f" the configured DMSS instance; {Config.DMSS_HOST}:{Config.DMSS_PORT}"
            )
        )
        dmss_api.explorer_remove_by_path(Config.APPLICATION_DATA_SOURCE, {"directory": "DMT"})
    except ApiException as error:
        if error.status == 404:
            logger.warning("Could not find the DMT application in DMSS...")
            pass
        else:
            raise error

    for folder in Config.ENTITY_APPLICATION_SETTINGS["packages"] + Config.ENTITY_APPLICATION_SETTINGS["entities"]:
        logger.info(f"Deleting package '{folder}' from DMSS...")
        data_source, folder = folder.split("/", 1)
        try:
            dmss_api.explorer_remove_by_path(data_source, {"directory": folder})
        except ApiException as error:
            if error.status == 404:
                logger.warning(f"Could not find '{folder}' in DMSS...")
                pass
            else:
                raise error
    logger.info("-------------- DONE ----------------")


@app.cli.command()
def init_application():
    logger.info("-------------- IMPORTING Application FILES ----------------")
    data_sources_to_import = []
    try:
        data_sources_to_import = os.listdir(f"{Config.APPLICATION_HOME}/data_sources/")
    except FileNotFoundError:
        logger.warning(
            f"No 'data_source' directory was found under '{Config.APPLICATION_HOME}/'. Nothing to import..."
        )

    for filename in data_sources_to_import:
        with open(f"{Config.APPLICATION_HOME}/data_sources/{filename}") as file:
            document = json.load(file)
            try:
                dmss_api.data_source_save(document["name"], data_source_request=document)
            except ApiException:
                pass

    for folder in os.listdir(f"{Config.APPLICATION_HOME}/applications/"):
        import_package(
            f"{Config.APPLICATION_HOME}/applications/{folder}",
            data_source=Config.APPLICATION_DATA_SOURCE,
            is_root=True,
        )

    logger.info(f"Importing package(s) {Config.ENTITY_APPLICATION_SETTINGS['packages']}")
    for folder in Config.ENTITY_APPLICATION_SETTINGS["packages"]:
        data_source, folder = folder.split("/", 1)
        import_package(
            f"{Config.APPLICATION_HOME}/{folder}", data_source=data_source, is_root=True,
        )

    logger.info("-------------- DONE ----------------")

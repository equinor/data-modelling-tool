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
    logger.info("-------------- REMOVING OLD APPLICATION FILES ----------------")
    logger.info(
        (
            "Removing application specific files from"
            f" the configured DMSS instance; {Config.DMSS_HOST}:{Config.DMSS_PORT}"
        )
    )
    for folder in Config.APP_SETTINGS["packages"]:
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
    logger.info("-------------- IMPORTING PACKAGES ----------------")
    logger.info("_____ importing data sources _____")
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

    logger.info("_____ DONE importing data sources _____")

    logger.info(f"_____ importing blueprints and entities ({Config.APP_SETTINGS['packages']})_____")
    for folder in Config.APP_SETTINGS["packages"]:
        data_source, folder = folder.split("/", 1)
        import_package(
            f"{Config.APPLICATION_HOME}/data/{data_source}/{folder}", data_source=data_source, is_root=True,
        )
    logger.info(f"_____ DONE importing blueprints and entities ({Config.APP_SETTINGS['packages']})_____")

    logger.info("-------------- DONE ----------------")

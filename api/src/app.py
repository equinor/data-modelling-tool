import os

from flask import Flask

from config import Config
from controllers import blueprints, explorer, entity, index, document as DocumentBlueprint, system
from utils.logging import logger
from services.dmss import dmss_api
from dmss_api.exceptions import ApiException
import json

from utils.package_import import import_package


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    app.register_blueprint(DocumentBlueprint.blueprint)
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
        logger.info("Remove DMT application")
        dmss_api.explorer_remove_by_path(Config.APPLICATION_DATA_SOURCE, {"directory": "DMT"})
    except ApiException:
        logger.info("Could not remove DMT")
        pass

    for folder in Config.ENTITY_APPLICATION_SETTINGS["packages"]:
        logger.info(f"Remove blueprint package: {folder}")
        data_source, folder = folder.split("/", 1)
        try:
            dmss_api.explorer_remove_by_path(data_source, {"directory": folder})
        except ApiException:
            pass

    for folder in Config.ENTITY_APPLICATION_SETTINGS["entities"]:
        data_source, folder = folder.split("/", 1)
        logger.info(f"Remove entity package: {folder}")
        try:
            dmss_api.explorer_remove_by_path(data_source, {"directory": folder})
        except ApiException:
            pass


@app.cli.command()
def init_application():
    for filename in os.listdir(f"{Config.APPLICATION_HOME}/data_sources/"):
        with open(os.path.join(f"{Config.APPLICATION_HOME}/data_sources/", filename)) as file:
            document = json.load(file)
            try:
                dmss_api.data_source_save(document["name"], data_source_request=document)
            except ApiException:
                pass

    for folder in Config.SYSTEM_FOLDERS:
        import_package(
            f"{Config.APPLICATION_HOME}/applications/{folder}",
            data_source=Config.APPLICATION_DATA_SOURCE,
            is_root=True,
        )

    logger.info(f"Importing blueprint package(s) {Config.ENTITY_APPLICATION_SETTINGS['packages']}")
    for folder in Config.ENTITY_APPLICATION_SETTINGS["packages"]:
        data_source, folder = folder.split("/", 1)
        import_package(
            f"{Config.APPLICATION_HOME}/blueprints/{folder}", data_source=data_source, is_root=True,
        )

    logger.info(f"Importing entity package(s) {Config.ENTITY_APPLICATION_SETTINGS['entities']}")
    for folder in Config.ENTITY_APPLICATION_SETTINGS["entities"]:
        data_source, folder = folder.split("/", 1)
        import_package(
            f"{Config.APPLICATION_HOME}/entities/{folder}", data_source=data_source, is_root=True,
        )

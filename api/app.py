import os

from flask import Flask
from utils.package_import import import_package

from config import Config
from core.rest import Actions, Blueprints, DataSource, Document as DocumentBlueprint, Explorer, Index, System, Entity
from utils.logging import logger
from services.data_modelling_document_service import datasource_api
from core.service.document_service import explorer_api
from dmss_api.exceptions import ApiException
import json


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    app.register_blueprint(DocumentBlueprint.blueprint)
    app.register_blueprint(Explorer.blueprint)
    app.register_blueprint(DataSource.blueprint)
    app.register_blueprint(Index.blueprint)
    app.register_blueprint(System.blueprint)
    app.register_blueprint(Actions.blueprint)
    app.register_blueprint(Blueprints.blueprint)
    app.register_blueprint(Entity.blueprint)
    app.secret_key = os.urandom(64)
    return app


app = create_app(Config)


@app.cli.command()
def remove_application():
    try:
        explorer_api.remove_by_path(Config.APPLICATION_DATA_SOURCE, {"directory": "DMT"})
    except ApiException:
        logger.info(f"Could not remove DMT")
        pass

    for folder in Config.ENTITY_APPLICATION_SETTINGS["packages"]:
        logger.info(f"Remove blueprint package: {folder}")
        data_source, folder = folder.split("/", 1)
        try:
            explorer_api.remove_by_path(data_source, {"directory": folder})
        except ApiException:
            pass

    for folder in Config.ENTITY_APPLICATION_SETTINGS["entities"]:
        data_source, folder = folder.split("/", 1)
        logger.info(f"Remove entity package: {folder}")
        try:
            explorer_api.remove_by_path(data_source, {"directory": folder})
        except ApiException:
            pass


@app.cli.command()
def init_application():
    for filename in os.listdir(f"{Config.APPLICATION_HOME}/data_sources/"):
        with open(os.path.join(f"{Config.APPLICATION_HOME}/data_sources/", filename)) as file:
            document = json.load(file)
            try:
                datasource_api.save(document["name"], request_body=document)
            except ApiException:
                pass

    for folder in Config.SYSTEM_FOLDERS:
        import_package(
            f"{Config.APPLICATION_HOME}/core/{folder}", data_source=Config.APPLICATION_DATA_SOURCE, is_root=True
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

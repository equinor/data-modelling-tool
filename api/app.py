import json
from functools import lru_cache

import click
from flask import Flask, g

from config import Config
from core.enums import SIMOS
from core.rest import DataSource, Document as DocumentBlueprint, Explorer, Index, System
from core.utility import wipe_db
from services.database import data_modelling_tool_db as dmt_db
from utils.debugging import enable_remote_debugging
from utils.logging import logger
from utils.package_import import import_package


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    app.register_blueprint(DocumentBlueprint.blueprint)
    app.register_blueprint(Explorer.blueprint)
    app.register_blueprint(DataSource.blueprint)
    app.register_blueprint(Index.blueprint)
    app.register_blueprint(System.blueprint)
    return app


if Config.REMOTE_DEBUG in (1, "True", "1", True):
    enable_remote_debugging()

app = create_app(Config)

logger.info(f"Running in environment: {app.config['ENVIRONMENT']}")


def import_application_settings():
    with open(f"{Config.APPLICATION_HOME}/settings.json") as json_file:
        application_settings = json.load(json_file)
        dmt_db[Config.SYSTEM_COLLECTION].insert_one(application_settings)
        logger.info(f"Imported application settings {application_settings['name']}")
        return application_settings


@app.before_request
@lru_cache(maxsize=Config.CACHE_MAX_SIZE)
def load_application_settings():
    g.application_settings = dmt_db[Config.SYSTEM_COLLECTION].find_one(filter={"type": SIMOS.APPLICATION.value})


@app.cli.command()
def init_application():
    application_settings = import_application_settings()

    for folder in Config.SYSTEM_FOLDERS:
        import_package(f"{Config.APPLICATION_HOME}/core/{folder}", collection=Config.SYSTEM_COLLECTION, is_root=True)

    for folder in application_settings["blueprints"]:
        import_package(
            f"{Config.APPLICATION_HOME}/blueprints/{folder}", collection=Config.BLUEPRINT_COLLECTION, is_root=True
        )
    if "entities" in application_settings:
        for folder in application_settings["entities"]:
            import_package(
                f"{Config.APPLICATION_HOME}/entities/{folder}", collection=Config.ENTITY_COLLECTION, is_root=True
            )


@app.cli.command()
def drop_data_sources():
    print(f"Dropping collection data_sources")
    dmt_db.drop_collection("data_sources")


@app.cli.command()
@click.argument("file")
def import_data_source(file):
    try:
        with open(file) as json_file:
            document = json.load(json_file)
            id = document["name"]
            document["_id"] = id
            print(f"Importing {file} as data_source with id: {id}.")
            dmt_db["data_sources"].replace_one({"_id": id}, document, upsert=True)
    except Exception as error:
        logger.error(f"Failed to import file {file}: {error}")


@app.cli.command()
def nuke_db():
    wipe_db()

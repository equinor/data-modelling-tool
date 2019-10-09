import json

import click
from flask import Flask

from config import Config
from core.rest import DataSource, Document as DocumentBlueprint, Explorer, Index
from services.database import data_modelling_tool_db as dmt_db, model_db
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
    return app


if Config.REMOTE_DEBUG in (1, "True", "1", True):
    enable_remote_debugging()

app = create_app(Config)

logger.info(f"Running in environment: {app.config['ENVIRONMENT']}")

PACKAGE_PATHS = ["/code/schemas/CarsDemo", "/code/schemas/SIMOS", "/code/schemas/DMT"]


@app.cli.command()
@click.option(
    "--uncontained", "-U", is_flag=True, default=False, help="Import every subpackage as a separate document."
)
def import_packages(uncontained: bool = False):
    # TODO: Read data-source from Package-Config
    for folder in PACKAGE_PATHS:
        import_folder(uncontained, folder)


def import_folder(uncontained, folder):
    if uncontained:
        import_package(folder, uncontained, is_root=True)
    else:
        package = import_package(folder, uncontained)
        # TODO: isRoot should not be needed
        as_dict = package.to_dict()
        as_dict["isRoot"] = True
        dmt_db.templates.replace_one({"_id": package.uid}, as_dict, upsert=True)
        logger.info(f"Imported package {package.name}")


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
    print("Dropping all collections")
    # FIXME: Read names from the database
    for name in ["blueprints", "entities", "templates", "dmt-templates"]:
        print(f"Dropping collection '{name}'")
        model_db.drop_collection(name)
        dmt_db.drop_collection(name)

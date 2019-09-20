import json
from os.path import dirname

from flask import Flask
import click

from config import Config
from rest import create_api
from services.database import data_modelling_tool_db, model_db
from utils.debugging import enable_remote_debugging
from utils.files import getListOfFiles
from utils.logging import logger
from core.rest import Document, Explorer, Index


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    create_api(app)
    app.register_blueprint(Document.blueprint)
    app.register_blueprint(Explorer.blueprint)
    app.register_blueprint(Index.blueprint)
    return app


if Config.REMOTE_DEBUG in (1, "True", "1", True):
    enable_remote_debugging()

app = create_app(Config)

logger.info(f"Running in environment: {app.config['ENVIRONMENT']}")


@app.cli.command()
def init_import():
    collections = ["blueprints", "entities", "templates"]
    for collection in collections:
        init_import_internal(collection)


PATHS = {
    "blueprints": "/code/schemas/documents/blueprints",
    "entities": "/code/schemas/documents/entities",
    "templates": "/code/schemas/templates",
}


def init_import_internal(collection):
    for file in getListOfFiles(PATHS[collection]):
        try:
            id = dirname(file.split("/", 4)[-1])
            with open(file) as json_file:
                document = json.load(json_file)
                if collection == "templates":
                    id += document["meta"]["name"]
                else:
                    id += f"/{document['meta']['name']}"

                logger.info(f"Importing {file} as {collection} with id: {id}")
                document["_id"] = id

                if collection == "templates":
                    data_modelling_tool_db["templates"].replace_one({"_id": id}, document, upsert=True)
                else:
                    model_db[f"{collection}"].replace_one({"_id": id}, document, upsert=True)

        except Exception as Error:
            logger.error(f"Could not import file {file}: {Error}")
            exit(1)


@app.cli.command()
def drop_data_sources():
    print(f"Dropping collection data_sources")
    data_modelling_tool_db.drop_collection("data_sources")


@app.cli.command()
@click.argument("file")
def import_data_source(file):
    try:
        with open(file) as json_file:
            document = json.load(json_file)
            id = document["name"]
            document["_id"] = id
            print(f"Importing {file} as data_source with id: {id}.")
            data_modelling_tool_db["data_sources"].replace_one({"_id": id}, document, upsert=True)
    except Exception as error:
        logger.error(f"Failed to import file {file}: {error}")


@app.cli.command()
def nuke_db():
    print("Dropping all collections")
    # FIXME: Read names from the database
    for name in ["blueprints", "entities", "templates"]:
        print(f"Dropping collection '{name}'")
        model_db.drop_collection(name)
        data_modelling_tool_db.drop_collection(name)

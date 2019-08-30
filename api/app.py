import json

from flask import Flask
import click

from config import Config
from rest import create_api
from services.database import data_modelling_tool_db, model_db
from utils.debugging import enable_remote_debugging
from utils.files import getListOfFiles


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    create_api(app)
    return app


if Config.REMOTE_DEBUG in (1, "True", "1", True):
    enable_remote_debugging()

app = create_app(Config)


def import_dmt_templates():
    files = getListOfFiles("/code/schemas/templates")
    for file in files:
        print(f"Importing {file}.")
        id = file.split("/", 4)[-1]
        with open(file) as json_file:
            document = json.load(json_file)
            document["_id"] = id
            data_modelling_tool_db["templates"].replace_one({"_id": id}, document, upsert=True)


def import_maf_blueprints():
    files = getListOfFiles("/code/schemas/documents/blueprints")
    for file in files:
        id = file.split("/", 4)[-1]
        print(f"Importing {file} as data_source.")
        with open(file) as json_file:
            document = json.load(json_file)
            document["_id"] = id
            model_db["blueprints"].replace_one({"_id": id}, document, upsert=True)


@app.cli.command()
def init_import():
    import_dmt_templates()
    import_maf_blueprints()


@app.cli.command("import_data_source")
@click.argument("file")
def import_data_source(file):
    print(f"Importing {file} as data_source with id: {id}.")
    with open(file) as json_file:
        document = json.load(json_file)
        data_modelling_tool_db["data_sources"].insert_one(document)


@app.cli.command()
def import_all_data_sources():
    files = getListOfFiles("/code/schemas/data-sources")
    for file in files:
        print(f"Importing {file} as data_source.")
        with open(file) as json_file:
            document = json.load(json_file)
            data_modelling_tool_db["data_sources"].insert_one(document)


@app.cli.command()
def nuke_db():

    print("Dropping all collections", Config.ENVIRONMENT)
    # FIXME: Read names from the database

    collections_dmt = ["templates"]
    if Config.ENVIRONMENT == 'local':
        collections_dmt.append("data_sources")

    for name in collections_dmt:
        print(f"Dropping collection '{name}'")
        data_modelling_tool_db.drop_collection(name)

    for name in ["documents", "blueprints", "entities"]:
        model_db.drop_collection(name)

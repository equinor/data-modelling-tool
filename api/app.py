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


@app.cli.command()
def init_import():
    import_file_dict = {
        "blueprints": getListOfFiles("/code/schemas/documents/blueprints"),
        "entities": getListOfFiles("/code/schemas/documents/entities"),
        "templates": getListOfFiles("/code/schemas/templates"),
    }

    for collection, file_list in import_file_dict.items():
        for file in file_list:
            id = file.split("/", 4)[-1]
            print(f"Importing {file} as {collection} with id: {id}.")
            with open(file) as json_file:
                document = json.load(json_file)
                if collection == "templates":
                    document["_id"] = id
                    data_modelling_tool_db["templates"].replace_one({"_id": id}, document, upsert=True)
                else:
                    document["_id"] = id
                    model_db[f"{collection}"].replace_one({"_id": id}, document, upsert=True)


@app.cli.command()
@click.argument("file")
def import_data_source(file):
    print(f"Importing {file} as data_source with id: {id}.")
    with open(file) as json_file:
        document = json.load(json_file)
        data_modelling_tool_db["data_sources"].insert_one(document)


@app.cli.command()
def nuke_db():
    print("Dropping all collections")
    # FIXME: Read names from the database
    for name in ["documents", "templates"]:
        print(f"Dropping collection '{name}'")
        model_db.drop_collection(name)
        data_modelling_tool_db.drop_collection(name)

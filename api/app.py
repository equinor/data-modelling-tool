import json
import os
from os.path import dirname
from uuid import uuid4

import click
from flask import Flask

from config import Config
from core.domain.blueprint import Blueprint
from core.domain.package import Package
from core.rest import DataSource, Document as DocumentBlueprint, Explorer, Index
from core.tree_generator import Tree, TreeNode
from rest import create_api
from services.database import data_modelling_tool_db, model_db
from utils.debugging import enable_remote_debugging
from utils.files import getListOfFiles
from utils.logging import logger


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    create_api(app)
    app.register_blueprint(DocumentBlueprint.blueprint)
    app.register_blueprint(Explorer.blueprint)
    app.register_blueprint(DataSource.blueprint)
    app.register_blueprint(Index.blueprint)
    return app


if Config.REMOTE_DEBUG in (1, "True", "1", True):
    enable_remote_debugging()

app = create_app(Config)

logger.info(f"Running in environment: {app.config['ENVIRONMENT']}")


@app.cli.command()
def init_import():
    import_collection("blueprints", start_path="local-blueprints")
    import_collection("dmt-templates", start_path="templates")
    import_collection("entities", start_path="local-entities")


PACKAGE_PATHS = [
    "/code/schemas/CarsDemo",
    # "/code/schemas/demo__entities",
    "/code/schemas/SIMOS",
    "/code/schemas/DMT",
]

PATHS = {
    "blueprints": "/code/schemas/documents/blueprints",
    "entities": "/code/schemas/documents/entities",
    "dmt-templates": "/code/schemas/documents/templates",
}


def generate_tree(base_path):
    root = None
    for dirpath, _, files in os.walk(base_path):
        if dirpath == base_path:
            continue
        package = Package(
            name=str(dirpath.split("/")[-1]), description="", type="templates/package", is_root=root is None
        )
        node = TreeNode(document=package)
        if root is None:
            root = node
        # else:
        #     node.parent = parent


def import_package(path) -> Package:
    package = Package(name=os.path.basename(path).split(".")[0], description="", blueprints=[])

    for blueprint in next(os.walk(path))[2]:
        print(f"working on {blueprint}")
        # TODO: Check type. Handle things not a blueprint
        if blueprint[0] == "_":
            continue
        with open(f"{path}/{blueprint}") as json_file:
            data = json.load(json_file)
        data["uid"] = str(uuid4())
        blueprint = Blueprint.from_dict(data)
        # TODO: database:collection
        print(f"IMPORTING {blueprint.name}")
        model_db.blueprints.replace_one({"_id": blueprint.uid}, blueprint.to_dict(), upsert=True)
        package.blueprints.append({"uid": blueprint.uid, "name": blueprint.name})

    for folder in next(os.walk(path))[1]:
        # TODO: append Package, not package: Dict
        package.addPackage(import_package(f"{path}/{folder}"))

    return package


@app.cli.command()
def import_blueprint_package():
    for folder in PACKAGE_PATHS:
        # TODO: Allow only one root-package with the same name
        package = import_package(folder)
        package.uid = str(uuid4())
        # package.dependencies.append({"SIMOS": {
        #     "version": "0.0.1",
        #     "data-source": "templates",
        #     "package": "SIMOS",
        # }})

        print(f"IMPORTING PACKAGE {package.name}")
        model_db.blueprints.replace_one({"_id": package.uid}, package.to_dict(), upsert=True)


# def import_documents(collection, database, start_path=None):
#     base_path = PATHS[collection]
#     for path, subdirs, files in os.walk(base_path):
#         print(path)
#         print(subdirs)
#         print(files)
#         base_path_size = len(base_path)
#         relative_path = path[base_path_size:] or ""
#
#         documents = []
#         for filename in files:
#             file = os.path.join(path, filename)
#             with open(file) as json_file:
#                 data = json.load(json_file)
#
#             type = data["type"] if "type" in data else "templates/blueprint"
#
#             if type == "templates/blueprint":
#                 blueprint = Blueprint(
#                     name=data["name"] if "name" in data else filename.replace(".json", ""), description="", type=type
#                 )
#                 if "attributes" in data:
#                     blueprint.attributes = data["attributes"]
#                 else:
#                     logger.warn(f"Missing attributes in '{filename}'")
#                 TreeNode(document=blueprint, parent=node)
#             else:
#                 if "name" not in data:
#                     data["name"] = filename.replace(".json", "")
#
#                 entity = Entity(data)
#                 TreeNode(document=entity, parent=node)
#
#         parent = node
#     return root


def import_collection(collection, start_path=None):
    base_path = PATHS[collection]
    tree = Tree(data_source_id=start_path)
    root = generate_tree(base_path)
    if not root:
        raise Exception("Root node not found")
    tree.print_tree(root)
    tree.add(root)


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
    for name in ["blueprints", "entities", "templates", "dmt-templates"]:
        print(f"Dropping collection '{name}'")
        model_db.drop_collection(name)
        data_modelling_tool_db.drop_collection(name)


if __name__ == "__main__":
    # import_collection("blueprints", start_path="local-blueprints")
    import_collection("entities", start_path="local-entities")

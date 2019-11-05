# flake8: noqa: F401

from config import Config
from core.domain.dto import DTO
from core.domain.storage_recipe import StorageRecipe
from core.repository.interface.document_repository import DocumentRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
import zipfile
import io
import pathlib
import json
import os

from core.enums import DMT
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint
from jinja2 import Template

DOCKER_COMPOSE = """\
version: "3.4"

services:
  api:
    image: mariner.azurecr.io/dmt/api
    restart: unless-stopped
    depends_on:
      - db
    environment:
      FLASK_DEBUG: 1
      ENVIRONMENT: local
      MONGO_INITDB_ROOT_USERNAME: maf
      MONGO_INITDB_ROOT_PASSWORD: maf
      MONGO_INITDB_DATABASE: maf
      MONGO_DATA_MODELING_TOOL_DATABASE: dmt
    volumes:
      - ./home/:/home

  web:
    image: mariner.azurecr.io/dmt/web
    restart: unless-stopped
    volumes:
      - ./home/runnable.js:/code/src/runnable.js

  db:
    image: mongo:3.4
    command: --quiet
    environment:
      MONGO_INITDB_ROOT_USERNAME: maf
      MONGO_INITDB_ROOT_PASSWORD: maf
      MONGO_INITDB_DATABASE: maf
    volumes:
      - ./data/db:/data/db
      
  nginx:
    depends_on:
      - api
      - web
    image: mariner.azurecr.io/dmt/nginx
    ports:
      - "9000:80"
"""


def generate_runnable_file(runnable_models):
    class_template = Template(
        """\

{% for runnable_model in runnable_models %}
const {{ runnable_model["method"] }} = async ({document, config, setProgress}) => {
    return {}
}
{% endfor %}  
        
const runnableMethods = {
{% for runnable_model in runnable_models %}
    {{ runnable_model["method"] }}
{% endfor %}    
}

export default runnableMethods
"""
    )
    return class_template.render(runnable_models=runnable_models)


class CreateApplicationRequestObject(req.ValidRequestObject):
    def __init__(self, application_id=None):
        self.application_id = application_id

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "applicationId" not in adict:
            invalid_req.add_error("applicationId", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(application_id=adict.get("applicationId"))


# Reference: https://stackoverflow.com/questions/1855095/how-to-create-a-zip-archive-of-a-directory-in-python
def zip_all(ob, path, rel=""):
    basename = os.path.basename(path)
    if os.path.isdir(path):
        if rel == "":
            rel = basename
        ob.write(path, os.path.join(rel))
        for root, dirs, files in os.walk(path):
            for d in dirs:
                zip_all(ob, os.path.join(root, d), os.path.join(rel, d))
            for f in files:
                ob.write(os.path.join(root, f), os.path.join(rel, f))
            break
    elif os.path.isfile(path):
        ob.write(path, os.path.join(rel, basename))
    else:
        pass


def remove_ids(data):
    for key in ["uid", "_id"]:
        try:
            del data[key]
        except KeyError:
            pass
    return data


def zip_package(ob, document, document_repository, path):
    json_data = json.dumps(remove_ids(document.data))
    binary_data = json_data.encode()
    write_to = f"{path}/{document.data['name']}.json"
    print(f"Writing: {document.type} to {write_to}")

    if document.type != DMT.PACKAGE.value:
        ob.writestr(write_to, binary_data)

    blueprint = get_blueprint(document.type)
    storage_recipe: StorageRecipe = get_storage_recipe(blueprint)

    document_references = []
    for attribute in blueprint.get_attributes_with_reference():
        name = attribute["name"]
        is_contained_in_storage = storage_recipe.is_contained(attribute["name"], attribute["type"])
        if attribute.get("dimensions", "") == "*":
            if not is_contained_in_storage:
                if name in document.data:
                    references = document.data[name]
                    for reference in references:
                        document_reference: DTO = document_repository.get(reference["_id"])
                        document_references.append(document_reference)

    for document_reference in document_references:
        zip_package(ob, document_reference, document_repository, f"{path}/{document.data['name']}")


class CreateApplicationUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object: CreateApplicationRequestObject):
        application_id: str = request_object.application_id

        application: DTO = self.document_repository.get(application_id)
        if not application:
            raise EntityNotFoundException(uid=application_id)

        home_path = pathlib.Path(Config.APPLICATION_HOME)

        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, mode="w") as zip_file:
            zip_all(zip_file, f"{home_path}/core/SIMOS", rel="home/core/SIMOS")
            zip_all(zip_file, f"{home_path}/core/DMT", rel="home/core/DMT")
            zip_all(zip_file, f"{home_path}/data_sources", rel="home/data_sources")
            json_data = json.dumps(remove_ids(application.data))
            binary_data = json_data.encode()
            zip_file.writestr("home/settings.json", binary_data)
            runnable_file = generate_runnable_file(application.data["runnableModels"])
            zip_file.writestr("home/runnable.js", runnable_file)
            zip_file.writestr("docker-compose.yml", DOCKER_COMPOSE)
            for type in application.data["blueprints"]:
                root_package: DTO = self.document_repository.find({"name": type})
                zip_package(zip_file, root_package, self.document_repository, f"home/blueprints/")

        memory_file.seek(0)

        return res.ResponseSuccess(memory_file)

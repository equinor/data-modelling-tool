# flake8: noqa: F401

from config import Config
from classes.dto import DTO
from classes.storage_recipe import StorageRecipe
from core.repository import Repository
from core.repository.repository_exceptions import EntityNotFoundException
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
import zipfile
import io
import pathlib
import json
import os

from utils.logging import logger
from core.enums import DMT
from core.utility import get_blueprint
from jinja2 import Template

API_DOCKERFILE = f"""\
FROM mariner.azurecr.io/dmt/api:stable
COPY ./home {Config.APPLICATION_HOME}
"""

WEB_DOCKERFILE = """\
FROM mariner.azurecr.io/dmt/web:stable
CMD ["yarn", "start"]
COPY ./actions.js /code/src/actions.js
"""

DOCKER_COMPOSE = """\
version: "3.4"

services:
  api:
    build: api
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

  web:
    build: web
    restart: unless-stopped

  db:
    image: mongo:3.4
    command: --quiet
    environment:
      MONGO_INITDB_ROOT_USERNAME: maf
      MONGO_INITDB_ROOT_PASSWORD: maf
      MONGO_INITDB_DATABASE: maf
    logging:
      driver: "none"

  nginx:
    depends_on:
      - api
      - web
    image: mariner.azurecr.io/dmt/nginx-local
    ports:
      - "9000:80"
"""


def generate_runnable_file(runnable_models):
    class_template = Template(
        """\
// This file is tightly coupled with the settings.json file, which contain your application settings.
// The settings file has 'actions', they look like this;
//     {
//       "name": "Calculate",
//       "description": "Simulate 80kmh concrete crash. Fiat panda 2011.",
//       "input": "SSR-DataSource/CarPackage/Car",
//       "output": "SSR-DataSource/CarPackage/Result",
//       "method": "run"
//     },
//
// This action will be available on any entity of the type "SSR-DataSource/CarPackage/Car"(input).
// The name given in "method" must be the name of a function in this file, as well as being in the "runnableMethods" object at the end of this file.
// The main use case for this custom function is to call SIMOS calculations, and update result objects.
// The properties that are passed to the function looks like this;
//       type Input = {
//         blueprint: string
//         entity: any
//         path: string
//         id: string
//       }
//
//       type Output = {
//         blueprint: string
//         entity: any
//         path: string
//         dataSource: string
//         id: string
//       }
//
//       updateDocument(output: Output): Function
//
// Current limitations and caveats;
// * updateDocument is a callBack. That means that if the web-browser get's interrupted(refresh,closed, etc.) the callBack is lost.
// * The API uses a strict type system, so if the output entity does NOT match the output blueprint, that attribute will not be updated.
// * The API uses an "update" strategy when writing the output entity. This means that it merges the existing document with the provided output entity.
// * The output object must be left intact, and posted on every updateDocument call. Everything besides the output.entity object should be considered "read-only".
// Here are a few examples;
//
// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }
//
// function myExternalSystemCall(input) {
//   return {
//     jobId: 'kk873ks',
//     result: 123456,
//     executionTime: '1233215.34234ms',
//     progress: 100,
//     status: 'done',
//     message: 'job complete, no errors',
//   }
// }
//
// async function run({ input, output, updateDocument }) {
//   let entity = {
//     ...output.entity,
//     // This is an invalid attribute. Will not get written to database.
//     hallo: 'Hey',
//   }
//   updateDocument({ ...output, entity })
//
//   // If the browser is interrupted during this sleep, the rest of the function will NOT be executed.
//   await sleep(10000)
//   entity = { diameter: 346 }
//   updateDocument({ ...output, entity })
//   updateDocument({ ...output, entity: myExternalSystemCall(input) })
// }

{% for runnable_model in runnable_models %}
const {{ runnable_model["method"] }} = async ({input, output, updateDocument}) => {
    return {}
}
{% endfor %}
        
const runnableMethods = {
{% for runnable_model in runnable_models %}
    {{ runnable_model["method"] }},
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


def zip_package(ob, document: DTO, document_repository, path):
    document.data.pop("_id", None)
    document.data.pop("uid", None)
    json_data = json.dumps(document.data)
    binary_data = json_data.encode()
    write_to = f"{path}/{document.name}.json"
    logger.info(f"Writing: {document['type']} to {write_to}")

    if document["type"] != DMT.PACKAGE.value:
        ob.writestr(write_to, binary_data)

    blueprint = get_blueprint(document.type)

    document_references = []
    for attribute in blueprint.get_none_primitive_types():
        name = attribute.name
        is_contained_in_storage = blueprint.storage_recipes[0].is_contained(attribute.name, attribute.attribute_type)
        if attribute.dimensions == "*":
            if not is_contained_in_storage:
                if name in document.keys():
                    references = document[name]
                    for reference in references:
                        document_reference: DTO = document_repository.get(reference["_id"])
                        document_references.append(document_reference)

    for document_reference in document_references:
        zip_package(ob, document_reference, document_repository, f"{path}/{document.name}")


def strip_datasource(path):
    elements = path.split("/")
    if len(elements) == 1:
        return path
    else:
        return elements[1]


class CreateApplicationUseCase(uc.UseCase):
    def __init__(self, document_repository: Repository):
        self.document_repository = document_repository

    def process_request(self, request_object: CreateApplicationRequestObject):
        application_id: str = request_object.application_id

        application: DTO = self.document_repository.get(application_id)
        if not application:
            raise EntityNotFoundException(uid=application_id)

        home_path = pathlib.Path(Config.APPLICATION_HOME)

        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, mode="w") as zip_file:
            zip_all(zip_file, f"{home_path}/core/SIMOS", rel="api/home/core/SIMOS")
            zip_all(zip_file, f"{home_path}/core/DMT", rel="api/home/core/DMT")
            zip_all(zip_file, f"{home_path}/data_sources", rel="api/home/data_sources")
            application.data.pop("_id", None)
            application.data.pop("uid", None)
            json_data = json.dumps(application.data)
            binary_data = json_data.encode()
            zip_file.writestr("api/home/settings.json", binary_data)
            runnable_file = generate_runnable_file(application.data["actions"])
            zip_file.writestr("web/actions.js", runnable_file)
            zip_file.writestr("docker-compose.yml", DOCKER_COMPOSE)
            zip_file.writestr("web/Dockerfile", WEB_DOCKERFILE)
            zip_file.writestr("api/Dockerfile", API_DOCKERFILE)
            for package in application.data["packages"]:
                # TODO: Support including packages from different datasources
                # This is a temp. hack
                package = strip_datasource(package)
                root_package: DTO = self.document_repository.find({"name": package})
                zip_package(zip_file, root_package, self.document_repository, f"api/home/blueprints/")

        memory_file.seek(0)

        return res.ResponseSuccess(memory_file)

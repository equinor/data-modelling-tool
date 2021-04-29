# flake8: noqa
import json
import os
from zipfile import ZipFile

from jinja2 import Template

from config import Config
from domain_classes.dto import DTO
from enums import DMT
from services.document_service import DocumentService
from utils.blueprint_provider import BlueprintProvider

from utils.logging import logger


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


def zip_package(ob: ZipFile, document: DTO, path: str, document_service: DocumentService, data_source_id: str):
    document.data.pop("_id", None)
    document.data.pop("uid", None)
    json_data = json.dumps(document.data)
    binary_data = json_data.encode()
    write_to = f"{path}/{document.name}.json"
    logger.info(f"Writing: {document['type']} to {write_to}")

    if document["type"] != DMT.PACKAGE.value:
        ob.writestr(write_to, binary_data)

    blueprint_provider = BlueprintProvider()
    blueprint = blueprint_provider.get_blueprint(document.type)
    document_references = []
    for attribute in blueprint.get_none_primitive_types():
        name = attribute.name
        is_contained_in_storage = blueprint.storage_recipes[0].is_contained(attribute.name, attribute.attribute_type)
        if attribute.is_array():
            if not is_contained_in_storage:
                if name in document.keys():
                    references = document[name]
                    for reference in references:
                        document_reference: DTO = DTO(
                            document_service.uid_document_provider(data_source_id, reference["_id"])
                        )
                        document_references.append(document_reference)

    for document_reference in document_references:
        zip_package(ob, document_reference, f"{path}/{document.name}", document_service, data_source_id)


def strip_datasource(path):
    elements = path.split("/")
    if len(elements) == 1:
        return path
    else:
        return elements[1]


def zip_all(ob: ZipFile, path: str, real_name=""):
    basename = os.path.basename(path)
    if os.path.isdir(path):
        if real_name == "":
            real_name = basename
        ob.write(path, os.path.join(real_name))
        for root, dirs, files in os.walk(path):
            for d in dirs:
                zip_all(ob, os.path.join(root, d), os.path.join(real_name, d))
            for f in files:
                ob.write(os.path.join(root, f), os.path.join(real_name, f))
            break
    elif os.path.isfile(path):
        ob.write(path, os.path.join(real_name, basename))
    else:
        pass


def zip_package(ob: ZipFile, document: DTO, path, document_service: DocumentService(), data_source_id):
    document.data.pop("_id", None)
    document.data.pop("uid", None)
    json_data = json.dumps(document.data)
    binary_data = json_data.encode()
    write_to = f"{path}/{document.name}.json"
    logger.info(f"Writing: {document['type']} to {write_to}")

    if document["type"] != DMT.PACKAGE.value:
        ob.writestr(write_to, binary_data)

    blueprint_provider = BlueprintProvider()
    blueprint = blueprint_provider.get_blueprint(document.type)
    document_references = []
    for attribute in blueprint.get_none_primitive_types():
        name = attribute.name
        is_contained_in_storage = blueprint.storage_recipes[0].is_contained(attribute.name, attribute.attribute_type)
        if attribute.is_array():
            if not is_contained_in_storage:
                if name in document.keys():
                    references = document[name]
                    for reference in references:
                        document_reference: DTO = DTO(
                            document_service.uid_document_provider(data_source_id, reference["_id"])
                        )
                        document_references.append(document_reference)

    for document_reference in document_references:
        zip_package(ob, document_reference, f"{path}/{document.name}", document_service, data_source_id)


API_DOCKERFILE = f"""\
FROM mariner.azurecr.io/dmt/api:0.8
COPY ./home {Config.APPLICATION_HOME}
"""

WEB_DOCKERFILE = """\
FROM mariner.azurecr.io/dmt/web:0.8
# Overwrite the CMD from the prod image that uses the pre-build js-bundle. yarn start will reflect changes made in the actions.js
CMD ["yarn", "start"]
ENV REACT_APP_EXPORTED_APP=1
COPY ./actions.js /code/src/actions.js
"""

DOCKER_COMPOSE = """\
version: "3.4"

services:
  api:
    build: api
    restart: unless-stopped
    depends_on:
      - mainapi
    environment:
      FLASK_DEBUG: 1
      FLASK_ENV: production
      ENVIRONMENT: local
      DMSS_HOST: mainapi
      DMSS_PORT: 5000
    volumes:
      - ./api/home/:/code/home

  web:
    build: web
    restart: unless-stopped
    volumes:
      - ./web/external-plugins/:/code/src/external-plugins
      - ./web/actions.js:/code/src/actions.js
    stdin_open: true

  db:
    image: mongo:3.4
    command: --quiet
    restart: unless-stopped
    logging:
      driver: "none"
    environment:
      MONGO_INITDB_ROOT_USERNAME: maf
      MONGO_INITDB_ROOT_PASSWORD: maf

  mainapi:
    image: mariner.azurecr.io/dmss:v0.2.21
    restart: unless-stopped
    environment:
      ENVIRONMENT: local
      MONGO_INITDB_ROOT_USERNAME: maf
      MONGO_INITDB_ROOT_PASSWORD: maf
    depends_on:
      - db
    ports:
      - "5010:5000"

  nginx:
    links:
      - web
      - api
    depends_on:
      - api
      - web
    image: mariner.azurecr.io/dmt/nginx:0.8
    ports:
      - "9000:80"

  db-ui:
    image: mongo-express:0.49
    restart: unless-stopped
    ports:
      - "8090:8081"
    logging:
      driver: "none"
    environment:
      ME_CONFIG_MONGODB_SERVER: db
      ME_CONFIG_MONGODB_ADMINUSERNAME: maf
      ME_CONFIG_MONGODB_ADMINPASSWORD: maf
      ME_CONFIG_MONGODB_ENABLE_ADMIN: "true"
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


def generate_external_plugins():
    class_template = Template(
        """\
import React from 'react'

/**
 * How to use plugins in UI recipes:
 * - UI recipe must match the name of the plugin
 * - Select external from as plugin
 *
 * Work space for attaching plugin to the dmt tool.
 * External dependencies:
 * - option1: should either be provided by the DMT (in package.json)
 * - option2: create a lib folder and add transpiled javascript files. Similar to dist folders in node_modules.
 *
 * External plugins must have a unique name, not conflicting with the DMT official plugin names.
 */

const TestPlugin = ({ parent, document, children }) => {
  return 'MyPlugin'
}

const registeredPlugins = {
  MyPlugin: MyPlugin,
}

export default function pluginHook(uiRecipe) {
  return registeredPlugins[uiRecipe.name]
}

function MyPlugin(props) {
  const { updateEntity, document } = props
  return (<div>My Custom Plugin</div>)
}
"""
    )
    return class_template.render()
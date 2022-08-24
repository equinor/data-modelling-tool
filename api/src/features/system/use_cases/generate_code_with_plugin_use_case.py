from __future__ import annotations

import importlib
import io
import sys

from config import Config
from domain_classes.tree_node import Node
from enums import SIMOS
from restful.exceptions import NotFoundException
from services.application_service import ApplicationService
from services.document_service import DocumentService


def blueprints_in_package(package_node, data_source_id):
    blueprints = {}
    for child in package_node.traverse():
        if child.type == SIMOS.BLUEPRINT.value:
            blueprints[f"{data_source_id}/{child.filesystem_path()}"] = child.to_dict()
    return blueprints


def generate_code_with_plugin_use_case(data_source_id: str, plugin_name: str, document_path: str):
    document_service = DocumentService()
    application_service = ApplicationService(document_service)

    document_path: str = document_path
    plugin_name: str = plugin_name
    data_source_id: str = data_source_id

    if plugin_name not in Config.APP_SETTINGS["code_generators"]:
        raise NotFoundException(f"No plugin named '{plugin_name}' is loaded")

    tree_path = "/content/".join(document_path.split("/"))
    raw_document = document_service.document_provider(f"{data_source_id}/{tree_path}")
    document: Node = Node.from_dict(raw_document, raw_document["_id"], document_service.blueprint_provider)

    # If it's a package, find all blueprints in the package. Else, just add the one.
    blueprints = {}
    if document.type == SIMOS.PACKAGE.value:
        blueprints.update(blueprints_in_package(document, data_source_id))
    else:
        blueprints[f"{data_source_id}/{document_path}"] = document.to_dict()

    # Find all blueprints referenced in the requested blueprints
    referenced_blueprints = {}
    for key, value in blueprints.items():
        _related_bp = application_service.get_related_blueprints(key)
        referenced_blueprints.update(_related_bp)

    # Add all "SIMOS SYSTEM" Blueprints
    referenced_blueprints.update(application_service.get_related_blueprints(SIMOS.BLUEPRINT.value))

    # Merge all required blueprints to one dictionary
    blueprints.update(referenced_blueprints)

    # Load the plugin module
    # docs: https://docs.python.org/3/library/importlib.html#importing-a-source-file-directly
    spec = importlib.util.spec_from_file_location(
        plugin_name, f"{Config.APPLICATION_HOME}/code_generators/{plugin_name}/__init__.py"
    )
    module = importlib.util.module_from_spec(spec)
    sys.modules[plugin_name] = module
    spec.loader.exec_module(module)

    # Call the main function in the plugin module, with the dict of required blueprints as the single argument
    result: io.BytesIO = module.main(blueprints)
    return result

from __future__ import annotations

import importlib
import io
import json
import sys


from classes.tree_node import Node
from config import Config
from core.enums import DMT, SIMOS
from core.repository.repository_exceptions import PluginNotLoadedException
from core.service.document_service import DocumentService
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.use_case.utils.get_related_blueprints import get_related_blueprints


class GenerateCodeWithPluginRequestObject(req.ValidRequestObject):
    def __init__(self, document_path: str = None, plugin_name: str = None, data_source_id: str = None):
        self.document_path = document_path
        self.data_source_id = data_source_id
        self.plugin_name = plugin_name

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "documentPath" not in adict:
            invalid_req.add_error("documentPath", "is missing")

        if "pluginName" not in adict:
            invalid_req.add_error("pluginName", "is missing")

        if "dataSourceId" not in adict:
            invalid_req.add_error("dataSourceId", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(
            document_path=adict.get("documentPath"),
            data_source_id=adict.get("dataSourceId"),
            plugin_name=adict.get("pluginName"),
        )


def blueprints_in_package(package_node, data_source_id):
    blueprints = {}
    for child in package_node.traverse():
        if child.type == SIMOS.BLUEPRINT.value:
            blueprints[f"{data_source_id}/{child.filesystem_path()}"] = child.to_dict()
    return blueprints


class GenerateCodeWithPluginUseCase(uc.UseCase):
    def __init__(self):
        self.document_service = DocumentService()

    def process_request(self, request_object: GenerateCodeWithPluginRequestObject):
        document_path: str = request_object.document_path
        plugin_name: str = request_object.plugin_name
        data_source_id: str = request_object.data_source_id

        generators = Config.DMT_CODE_GENERATORS
        if plugin_name not in generators:
            raise PluginNotLoadedException(plugin_name)

        tree_path = "/content/".join(document_path.split("/"))
        document: Node = self.document_service.get_by_path(data_source_id=data_source_id, path=tree_path)

        # If it's a package, find all blueprints in the package. Else, just add the one.
        blueprints = {}
        if document.type == DMT.PACKAGE.value:
            blueprints.update(blueprints_in_package(document, data_source_id))
        else:
            blueprints[f"{data_source_id}/{document_path}"] = document.to_dict()

        # Find all blueprints referenced in the requested blueprints
        referenced_blueprints = {}
        for key, value in blueprints.items():
            _related_bp = get_related_blueprints(key)
            referenced_blueprints.update(_related_bp)

        # Add all "SIMOS SYSTEM" Blueprints
        referenced_blueprints.update(get_related_blueprints(SIMOS.BLUEPRINT.value))

        # Merge all required blueprints to one dictionary
        blueprints.update(referenced_blueprints)

        # Load the plugin module
        # docs: https://docs.python.org/3/library/importlib.html#importing-a-source-file-directly
        generator = generators[plugin_name]
        plugin_path = generator[Config.PLUGIN_PATH]
        spec = importlib.util.spec_from_file_location(plugin_name, plugin_path)
        module = importlib.util.module_from_spec(spec)
        sys.modules[plugin_name] = module
        spec.loader.exec_module(module)

        # Call the main function in the plugin module, with the dict of required blueprints as the single argument
        result: io.BytesIO = module.main(blueprints)
        return res.ResponseSuccess(result)

import io
import zipfile
from functools import lru_cache
from typing import Union

from config import Config
from domain_classes.blueprint import Blueprint
from domain_classes.dto import DTO
from domain_classes.tree_node import ListNode, Node
from enums import DMT
from repository.zip_file import ZipFileClient
from services.dmss import get_blueprint, get_document, get_document_by_uid


class DocumentService:
    def __init__(
        self,
        blueprint_provider=get_blueprint,
        document_provider=get_document,
        uid_document_provider=get_document_by_uid,
    ):
        self.blueprint_provider = blueprint_provider
        self.document_provider = document_provider
        self.uid_document_provider = uid_document_provider

    # Since we are instantiating a new DocumentService() on every request,
    # I don't think we will get too much trouble by caching here.
    # It's now fairly easy to call document_service.get_blueprint.invalidate_cache() if needed.
    @lru_cache(maxsize=Config.CACHE_MAX_SIZE)
    def get_blueprint(self, type: str) -> Blueprint:
        # Assumes resolved blueprints
        return Blueprint.from_dict(self.blueprint_provider(type))

    def clear_blueprint_cache(self):
        self.get_blueprint.cache_clear()

    # This now only works with "local" repository. Like Zip or Filesystem
    def save(self, node: Union[Node, ListNode], data_source_id: str, repository, path="") -> None:
        # Update none-contained attributes
        for child in node.children:
            # A list node is always contained on parent. Need to check the blueprint
            if child.is_array() and not child.attribute_is_contained():
                # If the node is a package, we build the path string to be used by "export zip"-repository
                if node.type == DMT.PACKAGE.value:
                    path = f"{path}/{node.name}/" if path else f"{node.name}"
                [self.save(x, data_source_id, repository, path) for x in child.children]
            elif child.not_contained():
                self.save(child, data_source_id, repository, path)
        ref_dict = node.to_ref_dict()
        dto = DTO(ref_dict)
        # Expand this when adding new repositories requiring PATH
        if isinstance(repository, ZipFileClient):
            dto.data["__path__"] = path
        repository.update(dto)

    def get_node_by_uid(self, data_source_id: str, document_uid: str, depth: int = 999) -> Node:
        document = self.uid_document_provider(data_source_id, document_uid, depth)
        return Node.from_dict(document, document["_id"], blueprint_provider=self.get_blueprint)

    def create_zip_export(self, data_source_id: str, document_uid: str) -> io.BytesIO:
        document = self.uid_document_provider(data_source_id, document_uid)
        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, mode="w") as zip_file:
            root_node: Node = Node.from_dict(document, document.get("_id"), blueprint_provider=self.get_blueprint)
            # Save the selected node, using custom ZipFile repository
            self.save(root_node, data_source_id, ZipFileClient(zip_file))

        memory_file.seek(0)
        return memory_file

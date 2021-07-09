import io
import zipfile
from functools import lru_cache
from typing import Dict, Union

from config import Config
from domain_classes.blueprint import Blueprint
from domain_classes.dto import DTO
from domain_classes.tree_node import ListNode, Node
from enums import BLUEPRINTS
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

    def save(self, node: Union[Node, ListNode], data_source_id: str, repository=None, path="") -> Dict:
        """
        Recursively saves a Node.
        Digs down to the leaf child, and based on storageContained,
        either saves the entity and returns the Reference, OR returns the entire entity.
        """
        if not node.entity:
            return {}

        # If the node is a package, we build the path string to be used by filesystem like repositories
        if node.type == BLUEPRINTS.PACKAGE.value:
            path = f"{path}/{node.name}/" if path else f"{node.name}"

        for child in node.children:
            if child.is_array():
                [self.save(x, data_source_id, repository, path) for x in child.children]
            else:
                self.save(child, data_source_id, repository, path)

        ref_dict = node.to_ref_dict()

        # If the node is not contained, and has data, save it!
        if not node.storage_contained() and ref_dict:
            dto = DTO(ref_dict)
            # Expand this when adding new repositories requiring PATH
            if isinstance(repository, ZipFileClient):
                dto.data["__path__"] = path
            repository.update(dto)
            return {"_id": node.uid, "type": node.entity["type"], "name": node.name}
        return ref_dict

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

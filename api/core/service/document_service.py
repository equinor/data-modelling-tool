import io
import zipfile
from typing import Union

from classes.dto import DTO
from classes.tree_node import ListNode, Node
from core.enums import DMT
from core.repository.zip_file import ZipFileClient
from core.utility import BlueprintProvider, get_document, get_document_by_uid


class DocumentService:
    def __init__(self, blueprint_provider=BlueprintProvider(), document_provider=get_document,
                 uid_document_provider=get_document_by_uid):
        self.blueprint_provider = blueprint_provider
        self.document_provider = document_provider
        self.uid_document_provider = uid_document_provider

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

    def get_node_by_uid(
            self, data_source_id: str, document_uid: str, depth: int = 999, reset_bp_cache: bool = True
    ) -> Node:
        # By default, reset the Blueprint cache in case a Blueprint has changed in DMSS.
        if reset_bp_cache:
            self.blueprint_provider.invalidate_cache()
        document = self.uid_document_provider(data_source_id, document_uid, depth)
        return Node.from_dict(document, document["_id"], blueprint_provider=self.blueprint_provider)

    def create_zip_export(self, data_source_id: str, document_uid: str) -> io.BytesIO:
        document = self.uid_document_provider(data_source_id, document_uid)["document"]
        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, mode="w") as zip_file:
            root_node: Node = Node.from_dict(
                document, document.get("_id"), blueprint_provider=self.blueprint_provider
            )
            # Save the selected node, using custom ZipFile repository
            self.save(root_node, data_source_id, ZipFileClient(zip_file))

        memory_file.seek(0)
        return memory_file

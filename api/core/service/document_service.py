import io
import zipfile
from functools import lru_cache
from typing import Dict, Union

from dmss_api import ApiException

from classes.dto import DTO
from classes.tree_node import ListNode, Node
from config import Config
from core.enums import DMT
from core.repository.repository_exceptions import (
    EntityNotFoundException,
    FileNotFoundException,
)
from core.repository.zip_file import ZipFileClient
from core.utility import BlueprintProvider
from services.data_modelling_document_service import dmss_api
from utils.logging import logger


def get_complete_document(data_source_id: str, document_uid: str) -> Dict:
    document = dmss_api.document_get_by_id(data_source_id=data_source_id, document_id=document_uid)
    return document["document"]


@lru_cache(maxsize=Config.CACHE_MAX_SIZE)
def get_cached_document(ds, doc, dep, blueprint_provider):
    try:
        document = dmss_api.document_get_by_id(data_source_id=ds, document_id=doc, depth=dep)
        document = document["document"]
    except ApiException as error:
        logger.exception(error)
        raise EntityNotFoundException(doc)

    return Node.from_dict(document, document["_id"], blueprint_provider=blueprint_provider)


class DocumentService:
    def __init__(self, blueprint_provider=BlueprintProvider()):
        self.blueprint_provider = blueprint_provider

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

    def get_by_uid_cached(self, data_source_id, document_uid, depth=999):
        blueprint_provider = self.blueprint_provider
        return get_cached_document(data_source_id, document_uid, depth, blueprint_provider)

    def get_by_uid(
        self, data_source_id: str, document_uid: str, depth: int = 999, reset_bp_cache: bool = True
    ) -> Node:
        # By default, reset the Blueprint cache in case a Blueprint has changed in DMSS.
        if reset_bp_cache:
            self.blueprint_provider.invalidate_cache()
        try:
            document = dmss_api.document_get_by_id(
                data_source_id=data_source_id, document_id=document_uid, depth=depth
            )
            document = document["document"]
        except ApiException as error:
            logger.exception(error)
            raise EntityNotFoundException(document_uid)

        return Node.from_dict(document, document["_id"], blueprint_provider=self.blueprint_provider)

    def create_zip_export(self, data_source_id: str, document_uid: str) -> io.BytesIO:
        document = dmss_api.document_get_by_id(data_source_id, document_uid)["document"]
        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, mode="w") as zip_file:
            root_node: Node = Node.from_dict(
                document, document.get("_id"), blueprint_provider=self.blueprint_provider
            )
            # Save the selected node, using custom ZipFile repository
            self.save(root_node, data_source_id, ZipFileClient(zip_file))

        memory_file.seek(0)
        return memory_file

    def get_by_path(self, data_source_id: str, path: str) -> Node:
        ref_elements = path.split("/", 1)
        package_name = ref_elements[0]

        package: DTO = DTO(dmss_api.package_find_by_name(data_source_id=data_source_id, name=package_name))
        if not package:
            raise FileNotFoundException(data_source_id, package_name, is_root=True)

        complete_document = dmss_api.document_get_by_id(data_source_id=data_source_id, document_id=package.uid)["document"]

        dto = DTO(complete_document)
        node = Node.from_dict(dto.data, dto.uid, blueprint_provider=self.blueprint_provider)

        if len(ref_elements) > 1:
            path = ref_elements[1]
            return node.get_by_name_path(path.split("/"))
        else:
            return node

    # Add file by parent directory
    def add(self, data_source_id: str, directory: str, document: dict):
        return dmss_api.explorer_add_to_path(data_source_id, {document: document, directory: directory})



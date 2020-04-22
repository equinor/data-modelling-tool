import io
import zipfile
from typing import Dict, Union

from dmss_api import ApiException

from classes.dto import DTO
from classes.tree_node import ListNode, Node
from core.enums import DMT, SIMOS
from core.repository.repository_exceptions import (
    EntityNotFoundException,
    FileNotFoundException,
)
from core.repository.zip_file import ZipFileClient
from core.use_case.utils.create_entity import CreateEntity
from core.utility import BlueprintProvider
from services.data_modelling_document_service import document_api, explorer_api, package_api, datasource_api
from utils.logging import logger


def get_complete_document(data_source_id: str, document_uid: str) -> Dict:
    document = document_api.get_by_id(data_source_id=data_source_id, document_id=document_uid)
    return document["document"]


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

    def get_by_uid(self, data_source_id: str, document_uid: str) -> Node:
        try:
            document = document_api.get_by_id(data_source_id=data_source_id, document_id=document_uid)
            document = document["document"]
        except ApiException as error:
            logger.exception(error)
            raise EntityNotFoundException(document_uid)

        return Node.from_dict(document, document["_id"], blueprint_provider=self.blueprint_provider)

    def create_zip_export(self, data_source_id: str, document_uid: str) -> io.BytesIO:
        try:
            complete_document = get_complete_document(data_source_id=data_source_id, document_uid=document_uid)
        except EntityNotFoundException as error:
            logger.exception(error)
            raise EntityNotFoundException(document_uid)

        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, mode="w") as zip_file:
            root_node: Node = Node.from_dict(
                complete_document, complete_document.get("_id"), blueprint_provider=self.blueprint_provider
            )
            # Save the selected node, using custom ZipFile repository
            self.save(root_node, data_source_id, ZipFileClient(zip_file))

        memory_file.seek(0)
        return memory_file

    def get_by_path(self, data_source_id: str, path: str):
        ref_elements = path.split("/", 1)
        package_name = ref_elements[0]

        package: DTO = DTO(package_api.find_by_name(data_source_id=data_source_id, name=package_name))
        if not package:
            raise FileNotFoundException(data_source_id, package_name, is_root=True)

        complete_document = get_complete_document(data_source_id=data_source_id, document_uid=package.uid)

        dto = DTO(complete_document)
        node = Node.from_dict(dto.data, dto.uid, blueprint_provider=self.blueprint_provider)

        if len(ref_elements) > 1:
            path = ref_elements[1]
            return node.get_by_name_path(path.split("/"))
        else:
            return node

    # Add file by parent directory
    def add(self, data_source_id: str, directory: str, document: dict):
        return explorer_api.add_to_path(data_source_id, {document: document, directory: directory})

    def instantiate_entity(self, type: str, name: str = None):
        entity: Dict = CreateEntity(self.blueprint_provider, name=name, type=type, description="").entity
        return entity

    def get_data_source(self, data_source_id: str):
        return datasource_api.get_data_source(data_source_id)

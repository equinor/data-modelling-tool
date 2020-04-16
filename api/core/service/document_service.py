import io
import zipfile
from typing import Dict, Union, List

from core.enums import DMT
from core.repository.repository_exceptions import (
    EntityNotFoundException,
    FileNotFoundException,
    InvalidAttributeException,
    RepositoryException,
)
from core.repository.zip_file import ZipFileClient
from core.utility import BlueprintProvider
from dmss_api import DocumentApi, PackageApi, ExplorerApi, DatasourceApi
from utils.logging import logger

from classes.blueprint_attribute import BlueprintAttribute
from classes.dto import DTO
from classes.tree_node import ListNode, Node
from config import Config

document_api = DocumentApi()
document_api.api_client.configuration.host = Config.DMSS_API

package_api = PackageApi()
package_api.api_client.configuration.host = Config.DMSS_API

explorer_api = ExplorerApi()
explorer_api.api_client.configuration.host = Config.DMSS_API

datasource_api = DatasourceApi()
datasource_api.api_client.configuration.host = Config.DMSS_API

def get_complete_document(data_source_id: str, document_uid: str) -> Dict:
    document = document_api.get_by_id(data_source_id=data_source_id, document_id=document_uid)
    return document["document"]


class DocumentService:
    def __init__(self, repository_provider=None, blueprint_provider=BlueprintProvider()):
        self.blueprint_provider = blueprint_provider
        self.repository_provider = repository_provider

    def invalidate_cache(self):
        self.blueprint_provider.invalidate_cache()

    def save(self, node: Union[Node, ListNode], data_source_id: str, repository=None, path="") -> None:
        # If not passed a custom repository to save into, use the DocumentService's repository
        if not repository:
            repository = self.repository_provider(data_source_id)
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
        except EntityNotFoundException as error:
            # this is an edge case for packages where the reference in a package entity has wrong document id.
            # the code caller of this method knows the name and node_type that belongs to the document_uid.
            # Thus, the caller code should create the Node and add error information to that node.
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

        package: DTO = package_api.find_by_name(data_source_id=data_source_id, name=package_name)
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

    def get_root_packages(self, data_source_id: str):
        return package_api.get(data_source_id)

    def get_all_data_sources(self):
        return datasource_api.get_all()

    def add_data_source(self, data_source_id, body):
        return datasource_api.save(data_source_id, body)

    def add_package(self, data_source_id: str, data: Dict):
        explorer_api.add_package(data_source_id, data)

    def remove_document(self, data_source_id: str, document_id: str, parent_id: str = None):
        explorer_api.remove(data_source_id, {"documentId": document_id, "parentId": parent_id})

    def rename_document(
        self, data_source_id: str, document_id: str, name: str, parent_uid: str = None, description: str = ""
    ):
        return explorer_api.rename(
            data_source_id,
            {"documentId": document_id, "parentId": parent_uid, "name": name, "description": description},
        )

    def add_document(
        self, data_source_id: str, parent_id: str, type: str, name: str, description: str, attribute_path: str
    ):
        return explorer_api.add_to_parent(
            data_source_id,
            {
                "parentId": parent_id,
                "type": type,
                "name": name,
                "description": description,
                "attribute": attribute_path,
            },
        )

    # Add file by parent directory
    def add(self, data_source_id: str, directory: str, document: dict):
        return explorer_api.add_to_path(data_source_id, {document: document, directory: directory})

    def instantiate_entity(self, type: str, name: str = None):

        entity: Dict = CreateEntity(self.blueprint_provider, name=name, type=type, description="").entity
        if type == SIMOS.BLUEPRINT.value:
            entity["attributes"] = get_required_attributes(type=type)

        return entity

    def search(self, data_source_id, search_data):
        repository = self.repository_provider(data_source_id)
        type = search_data.pop("type")

        blueprint = self.blueprint_provider.get_blueprint(type)

        # Raise error if posted attribute not in blueprint
        if invalid_type := next(
            (key for key in search_data.keys() if key not in blueprint.get_attribute_names()), None
        ):
            raise InvalidAttributeException(invalid_type, type)

        # Raise error if posted attribute value is not a string
        if not_string := next(
            ({key: value} for key, value in search_data.items() if not isinstance(value, str)), None
        ):
            raise RepositoryException(f"Search parameters must be strings. {not_string}")

        # The entities 'type' must match exactly
        process_search_data = {"type": type}

        # TODO: This is limited to mongoDB repositories
        # TODO: Can not search on nested entities
        # TODO: Does not work with lists in any way
        for key, search_value in search_data.items():
            attribute: BlueprintAttribute = blueprint.get_attribute_by_name(key)

            if attribute.is_array():
                raise RepositoryException("Searching on list attributes are not supported.")

            if search_value == "":
                continue

            if attribute.attribute_type == "string":
                process_search_data[key] = {"$regex": f".*{search_value}.*", "$options": "i"}
                continue

            if attribute.attribute_type in ["number", "integer"]:
                if search_value[0] == ">":
                    process_search_data[key] = {"$gt": float(search_value[1:])}
                    continue
                if search_value[0] == "<":
                    process_search_data[key] = {"$lt": float(search_value[1:])}
                    continue
                process_search_data[key] = float(search_value)

        result: List[DTO] = repository.find(process_search_data, single=False)
        result_list = {}
        for doc in result:
            result_list[doc.name] = doc.data

        return result_list

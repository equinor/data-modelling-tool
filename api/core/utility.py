import re
from functools import lru_cache

from dmss_api import ApiException

from classes.blueprint import Blueprint
from classes.dto import DTO
from classes.tree_node import Node
from config import Config
from core.repository.repository_exceptions import EntityNotFoundException
from services.data_modelling_document_service import dmss_api
from utils.logging import logger


def duplicate_filename(parent_node: Node, new_file_name: str):
    if next((child for child in parent_node.children if child.name == new_file_name), None):
        return True


def url_safe_name(name: str) -> bool:
    # Only allows alphanumeric, underscore, and dash
    expression = re.compile("^[A-Za-z0-9_-]*$")
    match = expression.match(name)
    if match:
        return True


# TODO: This should be removed when all code is using DMSS_API
def get_document_by_ref(type_ref) -> DTO:
    data_source = type_ref.split("/", 1)[0]
    path = type_ref.split("/", 1)[1]
    response = dmss_api.document_get_by_path(data_source, path=path)
    document = response.get("document", None)
    if not document:
        raise EntityNotFoundException(type_ref)
    return DTO(response["document"])


class BlueprintProvider:
    def invalidate_cache(self):
        try:
            logger.debug("invalidate cache")
            self.get_blueprint.cache_clear()
        except Exception as error:
            logger.warning("function is not instance of lru cache.", error)

    @lru_cache(maxsize=Config.CACHE_MAX_SIZE)
    def get_blueprint(self, type: str) -> Blueprint:
        try:
            return Blueprint(DTO(get_document(type)))
        except ApiException as error:
            logger.exception(error)
            raise EntityNotFoundException(uid=type)


# TODO: 'get_blueprint' should be a wrapper for this that returns a Bluprint
def get_document(fully_qualified_path: str) -> dict:
    """
    The default DMSS document getter.
    Used by DocumentService.
    Inject a mock 'get_document' in unit tests.
    """
    # TODO: Update dmss endpoint to handle a singe ID string
    # TODO: Update dmss endpoint to only return the raw document, not the blueprint(?)
    data_source, path = fully_qualified_path.split("/", 1)
    return dmss_api.document_get_by_path(data_source, path=path)["document"]

# TODO: remove when everything uses 'get_document'
def get_document_by_uid(data_source_id: str, document_id: str, depth: int = 999, ui_recipe = "", attribute="") -> dict:
    """
    The uid based DMSS document getter.
    Used by DocumentService.
    Inject a mock 'get_document_by_uid' in unit tests.
    """
    return dmss_api.document_get_by_id(data_source_id, document_id, depth=depth, ui_recipe=ui_recipe, attribute=attribute)["document"]


from functools import lru_cache

from dmss_api import ApiException

from config import Config
from domain_classes.blueprint import Blueprint
from domain_classes.dto import DTO
from repository.repository_exceptions import EntityNotFoundException
from services.dmss import dmss_api
from utils.logging import logger


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


def get_document(fully_qualified_path: str) -> dict:
    """
    The default DMSS document getter.
    Used by DocumentService.
    Inject a mock 'get_document' in unit unit.
    """
    # TODO: Update dmss endpoint to handle a singe ID string
    # TODO: Update dmss endpoint to only return the raw document, not the blueprint(?)
    data_source, path = fully_qualified_path.split("/", 1)
    return dmss_api.document_get_by_path(data_source, path=path)


# TODO: remove when everything uses 'get_document'
def get_document_by_uid(data_source_id: str, document_id: str, depth: int = 999, ui_recipe="", attribute="") -> dict:
    """
    The uid based DMSS document getter.
    Used by DocumentService.
    Inject a mock 'get_document_by_uid' in unit unit.
    """
    return dmss_api.document_get_by_id(
        data_source_id, document_id, depth=depth, ui_recipe=ui_recipe, attribute=attribute
    )["document"]

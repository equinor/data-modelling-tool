from functools import lru_cache

from config import Config
from domain_classes.blueprint import Blueprint
from domain_classes.tree_node import Node
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

    def get_node_by_uid(self, data_source_id: str, document_uid: str, depth: int = 999) -> Node:
        document = self.uid_document_provider(data_source_id, document_uid, depth)
        return Node.from_dict(document, document["_id"], blueprint_provider=self.get_blueprint)

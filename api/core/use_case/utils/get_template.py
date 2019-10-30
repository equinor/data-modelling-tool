from core.domain.blueprint import Blueprint
from core.domain.dto import DTO
from core.utility import get_document_by_ref
from functools import lru_cache
from config import Config


@lru_cache(maxsize=Config.CACHE_MAX_SIZE)
def get_blueprint(type: str) -> Blueprint:
    document: DTO = get_document_by_ref(type)
    if not document:
        return None
    return document.data

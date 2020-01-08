from functools import lru_cache

from classes.blueprint import Blueprint
from classes.dto import DTO
from config import Config
from core.utility import get_document_by_ref


@lru_cache(maxsize=Config.CACHE_MAX_SIZE)
def get_blueprint(type: str) -> Blueprint:
    document: DTO = get_document_by_ref(type)
    if not document:
        return None
    return Blueprint(document)

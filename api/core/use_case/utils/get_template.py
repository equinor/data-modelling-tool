from core.domain.blueprint import Blueprint
from core.domain.dto import DTO
from core.repository.template_repository import get_template_by_document_type
from functools import lru_cache
from config import Config


@lru_cache(maxsize=Config.CACHE_MAX_SIZE)
def get_blueprint(type: str) -> Blueprint:
    document: DTO = get_template_by_document_type(type)
    if not document:
        return None
    data = document.data
    data["_id"] = document.uid
    return Blueprint.from_dict(data)

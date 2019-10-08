from core.domain.blueprint import Blueprint
from core.repository.template_repository import get_template_by_document_type


def get_blueprint(type: str) -> Blueprint:
    DTO = get_template_by_document_type(type)
    if not DTO:
        return None
    data = DTO.data
    data["_id"] = DTO.uid

    return Blueprint.from_dict(data)

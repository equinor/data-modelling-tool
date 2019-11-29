from typing import Dict
from uuid import UUID

from stringcase import snakecase, camelcase
from core.domain.dynamic_models import StorageRecipe
from core.domain.dto import DTO
from core.domain.schema import Factory
from core.repository.interface.document_repository import DocumentRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint


def get_complete_document(document_uid: UUID, document_repository: DocumentRepository) -> Dict:
    document: DTO = document_repository.get(str(document_uid))
    if not document:
        raise EntityNotFoundException(uid=document_uid)

    blueprint = get_blueprint(document.type)

    if not isinstance(document.data, dict):
        data = document.data.to_dict(include_defaults=False)
    else:
        data = document.data

    result = data

    storage_recipe: StorageRecipe = get_storage_recipe(blueprint)

    for attribute in blueprint.attributes:
        attribute_name = snakecase(attribute.name)
        key = camelcase(attribute_name)
        attribute_type = attribute.type
        if attribute_name in data:
            if storage_recipe.is_contained(attribute_name, attribute_type):
                result[key] = data[attribute_name]
            else:
                if attribute.dimensions == "*":
                    items = data[attribute_name]
                    documents = [get_complete_document(item["_id"], document_repository) for item in items]
                    result[key] = documents
                else:
                    result[key] = get_complete_document(data[attribute_name]["_id"], document_repository)

    return result


class DocumentService:
    @staticmethod
    def get_by_uid(document_uid: UUID, document_repository: DocumentRepository) -> DTO:
        adict = get_complete_document(document_uid, document_repository)
        data = Factory(document_repository).create(template_type=adict["type"]).from_dict(adict)
        return DTO(data, uid=document_uid)

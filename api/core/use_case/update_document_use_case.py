from typing import Dict

import stringcase

from core.domain.dto import DTO
from core.domain.storage_recipe import StorageRecipe
from core.repository.interface.document_repository import DocumentRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint
from utils.logging import logger
from core.shared import response_object as res
from core.shared import request_object as req
from core.shared import use_case as uc
from dotted.collection import DottedDict


class UpdateDocumentRequestObject(req.ValidRequestObject):
    def __init__(self, document_id=None, data=None, attribute=None):
        self.data = data
        self.document_id = document_id
        self.attribute = attribute

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "document_id" not in adict:
            invalid_req.add_error("document_id", "is missing")

        if "data" not in adict:
            invalid_req.add_error("data", "is missing")
        else:
            data = adict["data"]
            print(data)
            """
            if "name" not in data:
                invalid_req.add_error("name", "is missing")

            if "type" not in data:
                invalid_req.add_error("type", "is missing")
            """

        if invalid_req.has_errors():
            return invalid_req

        return cls(data=adict.get("data"), document_id=adict.get("document_id"), attribute=adict.get("attribute"))


def create_reference(data: Dict, document_repository, type: str):
    data["type"] = type
    file = DTO(data)
    document_repository.add(file)
    return {"_id": file.uid, "name": file.data.get("name", ""), "type": type}


def update_attribute(attribute, data: Dict, storage_recipe: StorageRecipe, document_repository):
    is_contained_in_storage = storage_recipe.is_contained(attribute.name, attribute.type)
    attribute_data = data[attribute.name]

    if is_contained_in_storage:
        return attribute_data
    else:
        if attribute.dimensions == "*":
            references = []
            for instance in attribute_data:
                reference = create_reference(instance, document_repository, attribute.type)
                update_document(reference["_id"], instance, document_repository)
                references.append(reference)
            return references
        else:
            reference = create_reference(attribute_data, document_repository, attribute.type)
            return reference


def update_document(document_id, data: Dict, document_repository: DocumentRepository):
    document: DTO = document_repository.get(document_id)

    if not document:
        raise EntityNotFoundException(uid=document_id)

    blueprint = get_blueprint(document.type)
    if not blueprint:
        raise EntityNotFoundException(uid=document.type)

    storage_recipe: StorageRecipe = get_storage_recipe(blueprint)

    for key in data.keys():
        attribute = next((x for x in blueprint.attributes if x.name == key), None)
        if not attribute:
            print(f"Could not find attribute {key} in {document.uid}")
        else:
            if isinstance(document.data, dict):
                document.data[key] = update_attribute(attribute, data, storage_recipe, document_repository)
            else:
                setattr(
                    document.data,
                    stringcase.snakecase(key),
                    update_attribute(attribute, data, storage_recipe, document_repository),
                )
    return document


class UpdateDocumentUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object: UpdateDocumentRequestObject):
        document_id: str = request_object.document_id
        data: Dict = request_object.data
        attribute: Dict = request_object.attribute

        dto: DTO = self.document_repository.get(document_id)
        if not dto:
            raise EntityNotFoundException(uid=document_id)

        if attribute:
            # TODO: Use hasattr, setattr, and getattr
            if isinstance(dto.data, dict):
                _data = dto.data
            else:
                _data = dto.data.to_dict()
            dotted_data = DottedDict(_data)
            if attribute not in _data:
                _data[attribute] = []
            try:
                # Update only sub part
                dotted_data[attribute] = data
                data = dotted_data.to_python()
            except Exception:
                raise

        document = update_document(document_id, data, self.document_repository)

        self.document_repository.update(document)

        logger.info(f"Updated document '{document.uid}''")

        return res.ResponseSuccess(document)

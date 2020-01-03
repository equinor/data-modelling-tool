from typing import Dict

from classes.dto import DTO
from classes.storage_recipe import StorageRecipe
from core.repository import Repository
from core.repository.repository_exceptions import EntityNotFoundException
from core.use_case.utils.get_blueprint import get_blueprint
from utils.logging import logger
from core.shared import response_object as res
from core.shared import request_object as req
from core.shared import use_case as uc


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


def update_document(document_id, data: Dict, document_repository: Repository) -> DTO:
    document: DTO = document_repository.get(document_id)

    if not document:
        raise EntityNotFoundException(uid=document_id)

    blueprint = get_blueprint(document.type)
    if not blueprint:
        raise EntityNotFoundException(uid=document.type)

    for key in data.keys():
        # TODO: Sure we want this filter?
        attribute = next((x for x in blueprint.attributes if x.name == key), None)
        if not attribute:
            logger.error(f"Could not find attribute {key} in {document.uid}")
        else:
            document[key] = update_attribute(attribute, data, blueprint.storage_recipes[0], document_repository)

    return document


class UpdateDocumentUseCase(uc.UseCase):
    def __init__(self, document_repository: Repository):
        self.document_repository = document_repository

    def process_request(self, request_object: UpdateDocumentRequestObject):
        document_id: str = request_object.document_id
        data: Dict = request_object.data
        attribute: Dict = request_object.attribute

        if attribute:
            existing_data: DTO = self.document_repository.get(document_id).data
            if not existing_data:
                raise EntityNotFoundException(uid=document_id)
            existing_data[attribute] = data
            data = existing_data

        document = update_document(document_id, data, self.document_repository)

        self.document_repository.update(document)

        logger.info(f"Updated document '{document.uid}''")

        return res.ResponseSuccess(document)

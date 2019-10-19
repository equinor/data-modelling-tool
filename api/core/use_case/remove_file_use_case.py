from core.domain.dto import DTO
from core.domain.storage_recipe import StorageRecipe
from core.repository.repository_exceptions import EntityNotFoundException
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.repository.interface.document_repository import DocumentRepository


class RemoveFileRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, name=None, attribute=None):
        self.parent_id = parent_id
        self.name = name
        self.attribute = attribute

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "name" not in adict:
            invalid_req.add_error("name", "is missing")

        if "attribute" not in adict:
            invalid_req.add_error("attribute", "is missing")

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(parent_id=adict.get("parentId"), name=adict.get("name"), attribute=adict.get("attribute"))


class RemoveFileUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    # TODO: Make this prettier, maybe move to repository
    def _get_all_children(self, document):
        blueprint = get_blueprint(document.type)
        storage_recipe: StorageRecipe = get_storage_recipe(blueprint)

        result = []

        document_references = []
        # Use the blueprint to find attributes that contains references
        for attribute in blueprint.get_attributes_with_reference():
            name = attribute["name"]
            # What blueprint is this attribute pointing too
            is_contained_in_storage = storage_recipe.is_contained(attribute["name"], attribute["type"])
            if attribute.get("dimensions", "") == "*":
                if not is_contained_in_storage:
                    if name in document.data:
                        references = document.data[name]
                        for reference in references:
                            document_reference = self.document_repository.get(reference["_id"])
                            document_references.append(document_reference)

        for document_reference in document_references:
            result.append(document_reference)
            result += self._get_all_children(document_reference)

        return result

    def process_request(self, request_object):
        name: str = request_object.name
        parent_id: str = request_object.parent_id
        attribute: str = request_object.attribute

        parent: DTO = self.document_repository.get(parent_id)
        if not parent:
            raise EntityNotFoundException(uid=parent_id)

        data = parent.data

        # Find reference in parent
        reference = list(filter(lambda d: d["name"] == name, data[attribute]))

        # Remove reference from parent
        data[attribute] = list(filter(lambda d: d["name"] != name, data[attribute]))
        self.document_repository.update(parent)

        # Remove actual document
        document: DTO = self.document_repository.get(reference[0]["_id"])
        self.document_repository.delete(document)

        children = self._get_all_children(document)
        for child in children:
            self.document_repository.delete(DTO(uid=child.uid, data={}))
            logger.info(f"Removed child document '{child.uid}'")

        logger.info(f"Removed document '{reference}'")
        return res.ResponseSuccess(True)

from typing import List

from stringcase import snakecase, camelcase

from core.domain.dto import DTO
from core.domain.storage_recipe import StorageRecipe
from core.repository.interface.document_repository import DocumentRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint

# from dotted.collection import DottedDict


class GetDocumentRequestObject(req.ValidRequestObject):
    def __init__(self, document_id, ui_recipe, attribute):
        self.document_id = document_id
        self.ui_recipe = ui_recipe
        self.attribute = attribute

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "document_id" not in adict:
            invalid_req.add_error("document_id", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(
            document_id=adict.get("document_id"), ui_recipe=adict.get("ui_recipe"), attribute=adict.get("attribute")
        )


def get_document(document_id: str, ui_recipe_name: str, document_repository):
    result = {}

    dto: DTO = document_repository.get(document_id)
    if not dto:
        raise EntityNotFoundException(uid=document_id)

    blueprint = get_blueprint(dto.type)

    result["type"] = dto.type

    # ui_recipe: UIRecipe = get_ui_recipe(blueprint, ui_recipe_name)

    storage_recipe: StorageRecipe = get_storage_recipe(blueprint)

    for attribute in blueprint.attributes:
        attribute_name = snakecase(attribute.name)
        key = camelcase(attribute_name)
        attribute_type = attribute.type
        if hasattr(dto.data, attribute_name):
            if storage_recipe.is_contained(attribute_name, attribute_type):
                value = getattr(dto.data, attribute_name)
                try:
                    value = value.to_dict()
                except AttributeError:
                    pass
                result[key] = value
            else:
                if attribute.dimensions == "*":
                    documents = [
                        get_document(item.uid, "", document_repository) for item in getattr(dto.data, attribute_name)
                    ]
                    result[key] = documents
                else:
                    if "_id" in dto.data[attribute_name]:
                        result[key] = get_document(dto.data[attribute_name]["_id"], "", document_repository)

    return result


PRIMITIVES = ["string", "number", "integer", "boolean"]


def find_attribute(name: str, attributes: List):
    return next((x for x in attributes if x["name"] == name), None)


def get_attribute_type(blueprint, path: List):
    if len(path) == 0:
        return blueprint

    attribute_name = path.pop(0)
    if attribute_name.isdigit():
        if len(path) == 0:
            return blueprint
        attribute_name = path.pop(0)

    attribute = find_attribute(attribute_name, blueprint.attributes)
    if attribute:
        return get_attribute_type(get_blueprint(attribute["type"]), path)
    else:
        return None


class GetDocumentUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object: GetDocumentRequestObject):
        document_id: str = request_object.document_id
        # ui_recipe_name: str = request_object.ui_recipe
        # attribute: str = request_object.attribute

        dto: DTO = self.document_repository.get(document_id)
        if not dto:
            raise EntityNotFoundException(uid=document_id)

        blueprint = get_blueprint(dto.type)

        # data = get_document(document_id, ui_recipe_name, self.document_repository)
        data = dto.data.to_dict(include_defaults=False)
        blueprint_data = blueprint.to_dict(include_defaults=False)

        # if attribute:
        #     dotted_data = DottedDict(data)
        #     try:
        #         data = dotted_data[attribute].to_python()
        #     except Exception:
        #         data = {}
        #
        #     path = attribute.split(".")
        #     blueprint = get_attribute_type(blueprint, path)
        #     blueprint_data = blueprint.to_dict()

        children = []
        self.add_children_types(children, blueprint.attributes)

        return res.ResponseSuccess({"blueprint": blueprint_data, "document": data, "children": children})

    # todo control recursive iterations iterations, decided by plugin?
    def add_children_types(self, children, attributes):
        for attribute in attributes:
            if isinstance(attribute, dict):
                attribute_type = attribute["type"]
            else:
                attribute_type = attribute.type
            if attribute_type not in PRIMITIVES:
                child_blueprint = get_blueprint(attribute_type)
                children.append(child_blueprint.to_dict())
                self.add_children_types(children, child_blueprint.attributes)

from core.domain.dto import DTO
from core.domain.storage_recipe import StorageRecipe
from core.repository.mongo.document_repository import DocumentRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint


class GetDocumentRequestObject(req.ValidRequestObject):
    def __init__(self, document_id, ui_recipe):
        self.document_id = document_id
        self.ui_recipe = ui_recipe

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "document_id" not in adict:
            invalid_req.add_error("document_id", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(document_id=adict.get("document_id"), ui_recipe=adict.get("ui_recipe"))


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
        attribute_name = attribute["name"]
        attribute_type = attribute["type"]
        if attribute_name in dto.data:
            if storage_recipe.is_contained(attribute_name, attribute_type):
                result[attribute_name] = dto.data[attribute_name]
            else:
                if attribute.get("dimensions", "") == "*":
                    documents = [
                        get_document(item["_id"], "", document_repository) for item in dto.data[attribute_name]
                    ]
                    result[attribute_name] = documents
                else:
                    if "_id" in dto.data[attribute_name]:
                        result[attribute_name] = get_document(dto.data[attribute_name]["_id"], "", document_repository)

    return result


class GetDocumentUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository, get_repository):
        self.document_repository = document_repository
        self.get_repository = get_repository

    def process_request(self, request_object: GetDocumentRequestObject):
        document_id: str = request_object.document_id
        ui_recipe_name: str = request_object.ui_recipe

        dto: DTO = self.document_repository.get(document_id)
        if not dto:
            raise EntityNotFoundException(uid=document_id)

        blueprint = get_blueprint(dto.type)

        return res.ResponseSuccess(
            {
                "blueprint": blueprint.to_dict(),
                "document": get_document(document_id, ui_recipe_name, self.document_repository),
            }
        )

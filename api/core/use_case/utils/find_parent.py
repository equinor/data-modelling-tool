from core.domain.blueprint import get_attributes_with_reference
from core.domain.dto import DTO
from core.domain.storage_recipe import StorageRecipe
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint


def find_parent(document, target_id, document_repository):
    blueprint = get_blueprint(document.type)
    storage_recipe: StorageRecipe = get_storage_recipe(blueprint)

    result = None

    document_references = []

    for attribute in get_attributes_with_reference(blueprint):
        name = attribute["name"]
        is_contained_in_storage = storage_recipe.is_contained(attribute["name"], attribute["type"])
        if attribute.get("dimensions", "") == "*":
            if not is_contained_in_storage:
                if hasattr(document.data, name):
                    references = getattr(document.data, name)
                    for reference in references:
                        document_reference: DTO = document_repository.get(reference["_id"])
                        document_references.append(document_reference)

    for document_reference in document_references:
        if target_id == str(document_reference.uid):
            return document.uid
        result = find_parent(document_reference, target_id, document_repository)
        if result:
            return result

    return result

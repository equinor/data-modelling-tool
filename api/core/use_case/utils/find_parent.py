from classes.blueprint import Blueprint, get_none_primitive_types
from classes.dto import DTO
from classes.storage_recipe import StorageRecipe
from core.use_case.utils.get_blueprint import get_blueprint


def find_parent(document: DTO, target_id, document_repository):
    blueprint: Blueprint = get_blueprint(document.type)
    storage_recipe: StorageRecipe = blueprint.storage_recipes[0]

    result = None

    document_references = []

    for attribute in get_none_primitive_types(blueprint):
        name = attribute.name
        is_contained_in_storage = storage_recipe.is_contained(attribute.name, attribute.type)
        if attribute.dimensions == "*":
            if not is_contained_in_storage:
                if name in document.keys():
                    references = document[name]
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

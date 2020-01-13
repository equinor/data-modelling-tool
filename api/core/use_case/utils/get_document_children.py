# TODO: Make this prettier, maybe move to repository
from classes.blueprint import Blueprint
from classes.dto import DTO
from classes.storage_recipe import StorageRecipe

from core.utility import get_blueprint
from utils.data_structure.find import get


def get_document_children(document: DTO, document_repository):
    blueprint: Blueprint = get_blueprint(document.type)
    storage_recipe: StorageRecipe = blueprint.storage_recipes[0]
    result = []
    document_references = []

    for attribute in blueprint.get_none_primitive_types():
        name = get(attribute, "name")
        is_contained_in_storage = storage_recipe.is_contained(name, attribute.attribute_type)
        if attribute.dimensions == "*":
            if not is_contained_in_storage:
                if get(document.data, name):
                    references = get(document.data, name)
                    for reference in references:
                        document_reference = document_repository.get(reference["_id"])
                        document_references.append(document_reference)
        else:
            if not is_contained_in_storage:
                reference = get(document.data, name)
                document_reference = document_repository.get(reference["_id"])
                document_references.append(document_reference)
            else:
                if get(document.data, name):
                    result += get_document_children(DTO(get(document.data, name)), document_repository)

    for document_reference in document_references:
        result.append(document_reference)
        result += get_document_children(document_reference, document_repository)

    return result

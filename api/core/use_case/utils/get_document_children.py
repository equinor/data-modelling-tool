# TODO: Make this prettier, maybe move to repository
from core.domain.blueprint import get_attributes_with_reference
from core.domain.storage_recipe import StorageRecipe
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint


def get_document_children(document, document_repository):
    blueprint = get_blueprint(document.type)
    storage_recipe: StorageRecipe = get_storage_recipe(blueprint)

    result = []

    document_references = []
    # Use the blueprint to find attributes that contains references
    for attribute in get_attributes_with_reference(blueprint):
        name = attribute.name
        # What blueprint is this attribute pointing too
        is_contained_in_storage = storage_recipe.is_contained(name, attribute.type)
        if attribute.dimensions == "*":
            if not is_contained_in_storage:
                if hasattr(document.data, name):
                    references = getattr(document.data, name)
                    for reference in references:
                        document_reference = document_repository.get(reference.uid)
                        document_references.append(document_reference)

    for document_reference in document_references:
        result.append(document_reference)
        result += get_document_children(document_reference, document_repository)

    return result

# TODO: Make this prettier, maybe move to repository
from core.domain.dto import DTO

from core.domain.blueprint import get_attributes_with_reference
from core.domain.storage_recipe import StorageRecipe
from core.use_case.utils.get_reference import get_ref_id
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint
from utils.data_structure.find import get


def get_document_children(document, document_repository):
    blueprint = get_blueprint(get(document, "type"))
    storage_recipe: StorageRecipe = get_storage_recipe(blueprint)

    result = []

    document_references = []
    for attribute in get_attributes_with_reference(blueprint):
        name = get(attribute, "name")
        is_contained_in_storage = storage_recipe.is_contained(name, get(attribute, "type"))
        if get(attribute, "dimensions") == "*":
            if not is_contained_in_storage:
                if get(document.data, name):
                    references = get(document.data, name)
                    for reference in references:
                        document_reference = document_repository.get(get_ref_id(reference))
                        document_references.append(document_reference)
        else:
            if not is_contained_in_storage:
                reference = get(document.data, name)
                document_reference = document_repository.get(get_ref_id(reference))
                document_references.append(document_reference)
            else:
                if get(document.data, name):
                    result += get_document_children(DTO(get(document.data, name)), document_repository)

    for document_reference in document_references:
        result.append(document_reference)
        result += get_document_children(document_reference, document_repository)

    return result

from core.domain.storage_recipe import StorageRecipe, DefaultStorageRecipe


def get_storage_recipe(blueprint) -> StorageRecipe:
    storage_recipe = blueprint.get_storage_recipe()
    # TODO: Should we be able to store storage recipes both contained or not contained?
    # probably not, recipes have no reason to live outside of the blueprint.
    # There's one to one mapping of recipes attributes, and the blueprint attributes.
    # storage_document = get_blueprint(storage_recipe)
    if storage_recipe and "attributes" in storage_recipe:
        return StorageRecipe(name=storage_recipe["name"], attributes=storage_recipe["attributes"])
    else:
        return DefaultStorageRecipe()

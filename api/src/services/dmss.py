from dmss_api.apis import DefaultApi


from config import Config

dmss_api = DefaultApi()
dmss_api.api_client.configuration.host = Config.DMSS_API


def get_document(fully_qualified_path: str) -> dict:
    """
    The default DMSS document getter.
    Used by DocumentService.
    Inject a mock 'get_document' in unit unit.
    """
    # TODO: Update dmss endpoint to handle a singe ID string
    # TODO: Update dmss endpoint to only return the raw document, not the blueprint(?)
    data_source, path = fully_qualified_path.split("/", 1)
    return dmss_api.document_get_by_path(data_source, path=path)["document"]


def get_document_by_uid(data_source_id: str, document_id: str, depth: int = 999, ui_recipe="", attribute="") -> dict:
    """
    The uid based DMSS document getter.
    Used by DocumentService.
    Inject a mock 'get_document_by_uid' in unit unit.
    """
    return dmss_api.document_get_by_id(
        data_source_id, document_id, depth=depth, ui_recipe=ui_recipe, attribute=attribute
    )["document"]


def get_blueprint(type_ref: str) -> dict:
    """
    Fetches a resolved blueprint from DMSS
    """
    return dmss_api.blueprint_get(type_ref)

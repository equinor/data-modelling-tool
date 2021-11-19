from typing import Union

from dmss_api.apis import DefaultApi
from flask import request

from config import Config

dmss_api = DefaultApi()
dmss_api.api_client.configuration.host = Config.DMSS_API


def get_access_token() -> Union[str, None]:
    if auth_header_value := request.headers.get("Authorization"):
        head_split = auth_header_value.split(" ")
        if head_split[0].lower() == "bearer" and len(head_split) == 2:
            return head_split[1]
        raise ValueError("Authorization header malformed. Should be; 'Bearer myAccessTokenString'")
    else:
        return ""


def get_document(fully_qualified_path: str) -> dict:
    """
    The default DMSS document getter.
    Used by DocumentService.
    Inject a mock 'get_document' in unit unit.
    """
    # TODO: Update dmss endpoint to handle a singe ID string
    # TODO: Update dmss endpoint to only return the raw document, not the blueprint(?)
    data_source, path = fully_qualified_path.split("/", 1)
    dmss_api.api_client.configuration.access_token = get_access_token()
    return dmss_api.document_get_by_path(data_source, path=path)["document"]


def get_document_by_uid(data_source_id: str, document_id: str, depth: int = 999, ui_recipe="", attribute="") -> dict:
    """
    The uid based DMSS document getter.
    Used by DocumentService.
    Inject a mock 'get_document_by_uid' in unit unit.
    """
    dmss_api.api_client.default_headers["Authorization"] = "Bearer " + get_access_token()
    return dmss_api.document_get_by_id(
        data_source_id, document_id, depth=depth, ui_recipe=ui_recipe, attribute=attribute
    )["document"]


def get_blueprint(type_ref: str) -> dict:
    """
    Fetches a resolved blueprint from DMSS
    """
    dmss_api.api_client.default_headers["Authorization"] = "Bearer " + get_access_token()
    return dmss_api.blueprint_get(type_ref)


def get_personal_access_token() -> str:
    """
    Fetches a long lived Access Token
    """
    dmss_api.api_client.default_headers["Authorization"] = "Bearer " + get_access_token()
    return dmss_api.token_get()


def get_root_packages(data_source_id: str) -> dict:
    """
    Fetches a resolved blueprint from DMSS
    """
    dmss_api.api_client.default_headers["Authorization"] = "Bearer " + get_access_token()
    return dmss_api.package_get(data_source_id)

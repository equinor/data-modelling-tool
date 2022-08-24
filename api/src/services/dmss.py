import json
from typing import Union

import requests
from dmss_api.apis import DefaultApi
from requests import HTTPError

from config import Config
from store_headers_middleware import get_access_key_header, get_auth_header
from utils.logging import logger

dmss_api = DefaultApi()
dmss_api.api_client.configuration.host = Config.DMSS_API


def get_access_token() -> Union[str, None]:
    auth_header = get_auth_header()
    if auth_header:
        head_split = auth_header.split(" ")
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


def get_document_by_uid(
    data_source_id: str, document_id: str, depth: int = 999, ui_recipe="", attribute="", token: str = None
) -> dict:
    """
    The uid based DMSS document getter.
    Used by DocumentService.
    Inject a mock 'get_document_by_uid' in unit unit.
    """

    # The generated API package was transforming data types. ie. parsing datetime from strings...

    headers = {"Authorization": f"Bearer {token or get_access_token()}", "Access-Key": token or get_access_token()}
    params = {"depth": depth, "ui_recipe": ui_recipe, "attribute": attribute}
    req = requests.get(
        f"{Config.DMSS_API}/api/v1/documents/{data_source_id}/{document_id}", params=params, headers=headers
    )
    req.raise_for_status()

    return req.json()


def update_document_by_uid(document_id: str, document: dict, token: str = None) -> dict:

    headers = {"Authorization": f"Bearer {token or get_access_token()}", "Access-Key": token or get_access_token()}
    form_data = {k: json.dumps(v) if isinstance(v, dict) else str(v) for k, v in document.items()}
    req = requests.put(
        f"{Config.DMSS_API}/api/v1/documents/{document_id}/?update_uncontained=False",
        data=form_data,
        headers=headers,
    )
    try:
        req.raise_for_status()
    except HTTPError as error:
        logger.error(error.response.text)
        raise HTTPError(error.response.text)
    return req.json()


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
    pat_in_header = get_access_key_header()
    if pat_in_header:
        return pat_in_header
    dmss_api.api_client.default_headers["Authorization"] = "Bearer " + get_access_token()
    return dmss_api.token_create()

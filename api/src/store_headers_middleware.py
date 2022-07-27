from starlette.types import ASGIApp, Receive, Scope, Send
from contextvars import ContextVar
from typing import Union


AUTH_HEADER_CTX_KEY = "auth_header"
ACCESS_KEY_HEADER_CTX_KEY = "access_key_header"

_auth_header_ctx_var: ContextVar[str] = ContextVar(AUTH_HEADER_CTX_KEY, default=None)
_access_key_header_ctx_var: ContextVar[str] = ContextVar(ACCESS_KEY_HEADER_CTX_KEY, default=None)


def get_access_token() -> Union[str, None]:
    auth_header = _auth_header_ctx_var.get()
    if auth_header:
        head_split = auth_header.split(" ")
        if head_split[0].lower() == "bearer" and len(head_split) == 2:
            return head_split[1]
        raise ValueError("Authorization header malformed. Should be; 'Bearer myAccessTokenString'")
    else:
        return ""


def get_access_key_header() -> Union[str, None]:
    return _access_key_header_ctx_var.get()


class AuthMiddleware:
    """
    Fast API middleware to set a "global" auth header variable. This variable has scope equal to the
    http request handled by Fast API.
    The auth header value is used by get_access_token() function to get the access token from the http request.
    Inspired by: https://github.com/encode/starlette/issues/420
    """

    def __init__(
        self,
        app: ASGIApp,
    ) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] not in ["http", "websocket"]:
            await self.app(scope, receive, send)
            return

        # set auth header
        index_list = [index for index, v in enumerate(scope["headers"]) if v[0] == b"authorization"]
        if len(index_list):
            auth_header_index = index_list[0]
            auth_header_value = scope["headers"][auth_header_index][1].decode()
            auth_header = _auth_header_ctx_var.set(auth_header_value)
        else:
            auth_header = _auth_header_ctx_var.set("")

        # set access keys header
        index_list = [index for index, v in enumerate(scope["headers"]) if v[0] == b"access-key"]
        if len(index_list):
            auth_header_index = index_list[0]
            auth_header_value = scope["headers"][auth_header_index][1].decode()
            auth_header = _auth_header_ctx_var.set(auth_header_value)
        else:
            auth_header = _auth_header_ctx_var.set("")

        await self.app(scope, receive, send)

        _auth_header_ctx_var.reset(auth_header)

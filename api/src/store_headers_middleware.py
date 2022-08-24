from contextvars import ContextVar

from starlette.types import ASGIApp, Receive, Scope, Send

AUTH_HEADER_CTX_KEY = "auth_header"
ACCESS_KEY_HEADER_CTX_KEY = "access_key_header"

_auth_header_ctx_var: ContextVar[str] = ContextVar(AUTH_HEADER_CTX_KEY, default="")
_access_key_header_ctx_var: ContextVar[str] = ContextVar(ACCESS_KEY_HEADER_CTX_KEY, default="")


def get_auth_header() -> str:
    return _auth_header_ctx_var.get()


def get_access_key_header() -> str:
    return _access_key_header_ctx_var.get()


class StoreHeadersMiddleware:
    """
    Fast API middleware to set global variables for different headers. These variables has scope equal to the
    http request.

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

        # set access key header
        index_list = [index for index, v in enumerate(scope["headers"]) if v[0] == b"access-key"]
        if len(index_list):
            access_key_header_index = index_list[0]
            access_key_header_value = scope["headers"][access_key_header_index][1].decode()
            access_key_header = _access_key_header_ctx_var.set(access_key_header_value)
        else:
            access_key_header = _access_key_header_ctx_var.set("")

        await self.app(scope, receive, send)

        _auth_header_ctx_var.reset(auth_header)
        _access_key_header_ctx_var.reset(access_key_header)

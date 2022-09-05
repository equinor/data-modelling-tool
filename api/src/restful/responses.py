import functools
import traceback
from typing import Callable, Type, TypeVar

from dmss_api.exceptions import ServiceException
from pydantic import BaseModel
from pydantic.error_wrappers import ValidationError
from requests import HTTPError
from starlette import status
from starlette.responses import JSONResponse, PlainTextResponse, Response

from restful.exceptions import (
    ApplicationException,
    BadRequestException,
    MissingPrivilegeException,
    NotFoundException,
    ValidationException,
)
from utils.logging import logger  # todo check if logger works


# Pydantic models can not inherit from "Exception", but we use it for openapi spec
class ErrorResponse(BaseModel):
    status: int = 500
    type: str = "ApplicationException"
    message: str = "The requested operation failed"
    debug: str = "An unknown and unhandled exception occurred in the API"
    data: dict = None


responses = {
    400: {"model": ErrorResponse, "content": {"application/json": {"example": BadRequestException().dict()}}},
    401: {
        "model": ErrorResponse,
        "content": {
            "application/json": {
                "example": ErrorResponse(
                    status=401, type="UnauthorizedException", message="Token validation failed"
                ).dict()
            }
        },
    },
    403: {"model": ErrorResponse, "content": {"application/json": {"example": MissingPrivilegeException().dict()}}},
    404: {"model": ErrorResponse, "content": {"application/json": {"example": NotFoundException().dict()}}},
    422: {"model": ErrorResponse, "content": {"application/json": {"example": ValidationException().dict()}}},
    500: {"model": ErrorResponse, "content": {"application/json": {"example": ApplicationException().dict()}}},
}

TResponse = TypeVar("TResponse", bound=Response)

"""
Function made to be used as a decorator for a route.
It will execute the function, and return a successfull response of the passed response class.
If the execution fails, it will return a JSONResponse with a standardized error model.
"""


def create_response(response_class: Type[TResponse]) -> Callable[..., Callable[..., TResponse | JSONResponse]]:
    def func_wrapper(func) -> Callable[..., TResponse | JSONResponse]:
        @functools.wraps(func)
        def wrapper_decorator(*args, **kwargs) -> TResponse | JSONResponse:
            try:
                result = func(*args, **kwargs)
                return response_class(result, status_code=status.HTTP_200_OK)
            except HTTPError as http_error:
                error_response = ErrorResponse(
                    status=http_error.response.status,
                    message="Failed to fetch an external resource",
                    debug=http_error.response,
                )
                logger.error(error_response)
                return JSONResponse(error_response.dict(), status_code=error_response.status)
            except ServiceException as dmss_exception:
                logger.error(dmss_exception)
                return PlainTextResponse(str(dmss_exception), status_code=status.HTTP_503_SERVICE_UNAVAILABLE)
            except (ValidationError, ValidationException) as e:
                logger.error(e)
                return JSONResponse(e.dict(), status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
            except NotFoundException as e:
                logger.error(e)
                return JSONResponse(e.dict(), status_code=status.HTTP_404_NOT_FOUND)
            except BadRequestException as e:
                logger.error(e)
                logger.error(e.dict())
                return JSONResponse(e.dict(), status_code=status.HTTP_400_BAD_REQUEST)
            except MissingPrivilegeException as e:
                logger.warning(e)
                return JSONResponse(e.dict(), status_code=status.HTTP_403_FORBIDDEN)
            except Exception as e:
                traceback.print_exc()
                logger.error(f"Unexpected unhandled exception: {e}")
                return JSONResponse(ErrorResponse().dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return wrapper_decorator

    return func_wrapper

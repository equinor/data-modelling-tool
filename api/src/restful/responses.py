import functools
import traceback
from typing import Callable, Type, TypeVar
from dmss_api.exceptions import ServiceException, UnauthorizedException

import json
from starlette import status
from starlette.responses import PlainTextResponse, Response

from utils.logging import logger  # todo check if logger works
from repository.repository_exceptions import (
    ApplicationNotLoadedException,
    FileNotFoundException,
    EntityNotFoundException,
    JobNotFoundException,
)

from features.system.exceptions import ApplicationNotFoundException, SetApplicationSettingsForbidden

TResponse = TypeVar("TResponse", bound=Response)


def create_response(response_class: Type[TResponse]) -> Callable[..., Callable[..., TResponse | PlainTextResponse]]:
    def func_wrapper(func) -> Callable[..., TResponse | PlainTextResponse]:
        @functools.wraps(func)
        def wrapper_decorator(*args, **kwargs) -> TResponse | PlainTextResponse:
            try:
                result = func(*args, **kwargs)
                return response_class(result, status_code=status.HTTP_200_OK)
            except ServiceException as dmss_exception:
                logger.error(dmss_exception)
                return PlainTextResponse(str(dmss_exception), status_code=status.HTTP_503_SERVICE_UNAVAILABLE)
            except (EntityNotFoundException, JobNotFoundException) as not_found:
                logger.error(not_found)
                return PlainTextResponse(str(not_found), status_code=status.HTTP_404_NOT_FOUND)
            except FileNotFoundException as not_found:
                logger.error(not_found)
                return PlainTextResponse(
                    str(f"The file '{not_found.file}' was not found on data source '{not_found.data_source_id}'"),
                    status_code=status.HTTP_404_NOT_FOUND,
                )
            except SetApplicationSettingsForbidden as e:
                return PlainTextResponse(e.message, status_code=status.HTTP_403_FORBIDDEN)
            except ApplicationNotLoadedException as e:
                logger.error(e)
                return PlainTextResponse(
                    str(f"Failed to fetch index: {e.message}"), status_code=status.HTTP_404_NOT_FOUND
                )
            except ApplicationNotFoundException as e:
                return PlainTextResponse(str(e.message), status_code=status.HTTP_404_NOT_FOUND)
            except UnauthorizedException as e:
                message = json.loads(e.body)["detail"]
                return PlainTextResponse(str(message), status.HTTP_401_UNAUTHORIZED)
            except Exception as e:
                traceback.print_exc()
                logger.error(f"Unexpected unhandled exception: {e}")
                return PlainTextResponse(
                    str(e),
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        return wrapper_decorator

    return func_wrapper

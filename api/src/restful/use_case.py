import json
from dmss_api.exceptions import ServiceException, UnauthorizedException
from starlette.responses import JSONResponse
from repository.repository_exceptions import (
    ApplicationNotLoadedException,
    FileNotFoundException,
    EntityNotFoundException,
    JobNotFoundException,
)

import traceback
from starlette import status


def create_error_response(
    error: Exception,
    status: int,
) -> JSONResponse:
    types = {
        400: "PARAMETERS_ERROR",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "RESOURCE_ERROR",
        422: "UNPROCESSABLE_ENTITY",
        500: "SYSTEM_ERROR",
    }
    if error.__class__.__name__ == "HTTPError":
        message = error.response.text
    elif error.__class__.__name__ == "Exception":
        message = error.args[0]
    else:
        message = error.message
    return JSONResponse({"type": types[status], "message": f"{error.__class__.__name__}: {message}"}, status)


# todo avoud using the custom response object, use built in fast api things instead
class UseCase(object):
    def execute(self, request_object):
        if not request_object:
            return create_error_response(Exception("Request object not valid"), status.HTTP_404_NOT_FOUND)
        try:
            return self.process_request(request_object)
        except ServiceException as dmss_exception:
            return create_error_response(dmss_exception, status.HTTP_500_INTERNAL_SERVER_ERROR)
        except (EntityNotFoundException, JobNotFoundException) as not_found:
            return create_error_response(not_found, status.HTTP_404_NOT_FOUND)
        except FileNotFoundException as not_found:
            return create_error_response(
                Exception(f"The file '{not_found.file}' was not found on data source '{not_found.data_source_id}'"),
                status.HTTP_404_NOT_FOUND,
            )
        except ApplicationNotLoadedException as e:
            return create_error_response(
                Exception(f"Failed to fetch index: {e.message}"), status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        except UnauthorizedException as e:
            message = json.loads(e.body)["detail"]
            return create_error_response(Exception(message), status.HTTP_401_UNAUTHORIZED)
        except Exception as exc:
            traceback.print_exc()
            return create_error_response(exc, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def process_request(self, request_object):
        raise NotImplementedError("process_request() not implemented by UseCase class")

from fastapi import HTTPException
from pydantic import BaseModel
from starlette import status as request_status


# Pydantic models can not inherit from "Exception", but we use it for openapi spec
class ErrorResponse(BaseModel):
    status: int = 500
    type: str = "ApplicationException"
    message: str = "The requested operation failed"
    debug: str = "An unknown and unhandled exception occurred in the API"
    data: dict = None


class ApplicationException(Exception):
    status: int = 500
    type: str = "ApplicationException"
    message: str = "The requested operation failed"
    debug: str = "An unknown and unhandled exception occurred in the API"
    data: dict = None

    def __init__(
        self,
        message: str = "The requested operation failed",
        debug: str = "An unknown and unhandled exception occurred in the API",
        data: dict = None,
        status: int = 500,
    ):
        self.status = status
        self.type = self.__class__.__name__
        self.message = message
        self.debug = debug
        self.data = data

    def dict(self):
        return {
            "status": self.status,
            "type": self.type,
            "message": self.message,
            "debug": self.debug,
            "data": self.data,
        }


class MissingPrivilegeException(ApplicationException):
    def __init__(
        self,
        message: str = "You do not have the required permissions",
        debug: str = "Action denied because of insufficient permissions",
        data: dict = None,
    ):
        self.type = self.__class__.__name__
        self.message = message
        self.debug = debug
        self.data = data
        self.status = request_status.HTTP_403_FORBIDDEN


class NotFoundException(ApplicationException):
    def __init__(
        self,
        message: str = "The requested resource could not be found",
        debug: str = "The requested resource could not be found",
        data: dict = None,
    ):
        self.type = self.__class__.__name__
        self.message = message
        self.debug = debug
        self.data = data
        self.status = request_status.HTTP_404_NOT_FOUND


class BadRequestException(ApplicationException):
    def __init__(
        self,
        message: str = "Invalid data for the operation",
        debug: str = "Unable to complete the requested operation with the given input values.",
        data: dict = None,
    ):
        super().__init__(message, debug, data)
        self.type = self.__class__.__name__
        self.status = request_status.HTTP_400_BAD_REQUEST


class ValidationException(ApplicationException):
    def __init__(
        self,
        message: str = "The received data is invalid",
        debug: str = "Values are invalid for requested operation.",
        data: dict = None,
    ):
        super().__init__(message, debug, data)
        self.type = self.__class__.__name__
        self.status = request_status.HTTP_422_UNPROCESSABLE_ENTITY


credentials_exception = HTTPException(
    status_code=request_status.HTTP_401_UNAUTHORIZED,
    detail="Token validation failed",
    headers={"WWW-Authenticate": "Bearer"},
)

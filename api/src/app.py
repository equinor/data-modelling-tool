
import click
import emoji
import uvicorn

from fastapi import APIRouter, FastAPI, Security
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.security import OAuth2AuthorizationCodeBearer
from starlette import status
from starlette.requests import Request
from starlette.responses import JSONResponse

from config import config
from restful.responses import ErrorResponse
from services.dmss import dmss_api
from store_headers_middleware import StoreHeadersMiddleware


prefix = "/api/v1"

oauth2_scheme = OAuth2AuthorizationCodeBearer(authorizationUrl="", tokenUrl="")


def auth_with_jwt(jwt_token: str = Security(oauth2_scheme)):
    # Authentication is handled by DMSS. Adding a security dependenciy is
    # necessary to generate correct JSON schema for openapi generator.
    pass


def create_app():

    from features.jobs import jobs


    public_routes = APIRouter()
    authenticated_routes = APIRouter()
    authenticated_routes.include_router(jobs.router)

    app = FastAPI(title="Data Modelling Tool", description="API for Data Modeling Tool (DMT)")
    app.include_router(public_routes, prefix=prefix)
    app.include_router(authenticated_routes, prefix=prefix, dependencies=[Security(auth_with_jwt)])

    app.add_middleware(StoreHeadersMiddleware)

    # Intercept FastAPI builtin validation errors, so they can be returned on our standardized format.
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            ErrorResponse(
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
                type="RequestValidationError",
                message="The received values are invalid",
                debug="The received values are invalid according to the endpoints model definition",
                data=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
            ).dict(),
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    return app


@click.group()
@click.option("--token", default="no-token", type=str)
def cli(token: str):
    dmss_api.api_client.default_headers["Authorization"] = "Bearer " + token




@cli.command()
def run():
    uvicorn.run(
        "app:create_app",
        host="0.0.0.0",  # nosec
        port=5000,
        reload=config.ENVIRONMENT == "local",
        factory=True,
        log_level=config.LOGGER_LEVEL.lower(),
    )


if __name__ == "__main__":
    cli()

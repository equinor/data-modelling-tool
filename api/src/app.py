import concurrent.futures
import io
import json
import os
import traceback
from pathlib import Path
from zipfile import ZipFile

import click
import emoji
import uvicorn
from dmss_api.exceptions import ApiException
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
from utils.create_application_utils import zip_all
from utils.import_package import import_package_tree, package_tree_from_zip
from utils.logging import logger

prefix = "/api/v1"

oauth2_scheme = OAuth2AuthorizationCodeBearer(authorizationUrl="", tokenUrl="")


def auth_with_jwt(jwt_token: str = Security(oauth2_scheme)):
    # Authentication is handled by DMSS. Adding a security dependenciy is
    # necessary to generate correct JSON schema for openapi generator.
    pass


def create_app():
    from features.blueprints import blueprints
    from features.entity import entity
    from features.jobs import jobs
    from features.system import system

    public_routes = APIRouter()
    authenticated_routes = APIRouter()
    public_routes.include_router(blueprints.router)
    public_routes.include_router(entity.router)
    authenticated_routes.include_router(jobs.router)
    public_routes.include_router(system.router)

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
def remove_application():
    logger.info("-------------- REMOVING OLD APPLICATION FILES ----------------")
    logger.debug(f"Removing application specific files from the configured DMSS instance; {config.DMSS_API}")

    def thread_function(settings: dict) -> bool:
        for package in settings.get("packages", []):
            data_source_alias, folder = package.split("/", 1)
            actual_data_source = next(
                (v for k, v in settings["dataSourceAliases"].items() if k == data_source_alias), data_source_alias
            )
            logger.info(f"Deleting package '{actual_data_source}/{folder}' from DMSS...")
            try:
                dmss_api.document_remove_by_path(actual_data_source, directory=folder)
            except ApiException as error:
                if error.status == 404:
                    logger.warning(emoji.emojize(f":warning: Could not find '{folder}' in DMSS..."))
                else:
                    raise error
        return True

    with concurrent.futures.ThreadPoolExecutor() as executor:
        for result in executor.map(thread_function, config.APP_SETTINGS.values()):
            logger.debug(result)
    logger.info("-------------- DONE ----------------")


@cli.command()
@click.argument("src")
@click.argument("dst")
def reset_package(src, dst):
    logger.info(f"-------------- RESETTING PACKAGE {dst} ----------------")
    if not Path(src).is_dir():
        raise ValueError(f"'{src}' is not a directory. Current working directory is '{os.getcwd()}'")
    data_source, folder = dst.split("/", 1)
    try:
        dmss_api.document_remove_by_path(data_source, directory=folder)
    except ApiException as error:
        if error.status == 404:
            logger.warning(emoji.emojize(f":warning: Could not find '{folder}' in DMSS..."))
        else:
            raise error

    memory_file = io.BytesIO()
    with ZipFile(memory_file, mode="w") as zip_file:
        zip_all(
            zip_file,
            src,
            real_name=folder,  # Use target package name as name in zip archive
            write_folder=True,
        )
    memory_file.seek(0)

    root_package = package_tree_from_zip(data_source, folder, memory_file)
    import_package_tree(root_package, data_source)

    logger.info("-------------- DONE ----------------")


@cli.command()
@click.argument("path")
def import_data_source(path: str):
    filename = Path(path).name
    logger.info(f"-------------- IMPORTING DATA SOURCE {filename} ----------------")
    with open(path) as file:
        document = json.load(file)
        try:
            dmss_api.data_source_save(document["name"], data_source_request=document)
            logger.info(f"Added data source '{document['name']}'")
        except (ApiException, KeyError) as error:
            if error.status == 400:
                logger.warning(
                    emoji.emojize(
                        f":warning: Could not import data source '{filename}'. "
                        "A data source with that name already exists"
                    )
                )
            else:
                raise ImportError(f"Failed to import data source '{filename}': {error}")
    logger.debug("_____ DONE importing data source _____")


@cli.command()
@click.pass_context
def init_application(context):
    logger.info("-------------- IMPORTING PACKAGES ----------------")

    def thread_function(settings: dict) -> None:
        app_directory_name = Path(settings["fileLocation"]).parent.name
        logger.debug(f"Importing data for app '{settings['name']}'")
        logger.debug("_____ importing data sources _____")
        ds_dir = f"{config.APPLICATION_HOME}/{app_directory_name}/{config.APPS_DATASOURCE_SUBFOLDER}/"
        data_sources_to_import = []
        try:
            data_sources_to_import = os.listdir(ds_dir)
        except FileNotFoundError:
            logger.warning(
                emoji.emojize(f":warning: No 'data_source' directory was found under '{ds_dir}'. Nothing to import...")
            )

        for filename in data_sources_to_import:
            context.invoke(import_data_source, path=f"{ds_dir}{filename}")

        logger.debug("_____ DONE importing data sources _____")

        logger.debug(f"_____ importing blueprints and entities {tuple(settings.get('packages', []))}_____")
        for package in settings.get("packages", []):
            data_source_alias, folder = package.split("/", 1)
            actual_data_source = settings["dataSourceAliases"].get(data_source_alias, data_source_alias)
            memory_file = io.BytesIO()
            with ZipFile(memory_file, mode="w") as zip_file:
                zip_all(
                    zip_file,
                    f"{config.APPLICATION_HOME}/{app_directory_name}/data/{data_source_alias}/{folder}",
                    write_folder=True,
                )
            memory_file.seek(0)

            try:
                root_package = package_tree_from_zip(actual_data_source, folder, memory_file)
                # Import the package into the data source defined in _aliases_, or using the data_source folder name
                import_package_tree(root_package, actual_data_source)
            except ApiException as error:
                raise ApiException(error.body)
            except Exception as error:
                traceback.print_exc()
                raise Exception(f"Something went wrong trying to upload the package '{package}' to DMSS; {error}")
        logger.debug(f"_____ DONE importing blueprints and entities {tuple(settings.get('packages', []))}_____")

    with concurrent.futures.ThreadPoolExecutor() as executor:
        for result in executor.map(thread_function, config.APP_SETTINGS.values()):
            logger.debug(result)
    logger.info(emoji.emojize("-------------- DONE ---------------- :check_mark_button:"))


@cli.command()
@click.pass_context
def reset_app(context):
    context.invoke(remove_application)
    context.invoke(init_application)
    config.load_app_settings()


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

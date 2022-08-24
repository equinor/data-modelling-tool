import io
import json
from pathlib import Path
from zipfile import ZipFile

from config import Config
from domain_classes.blueprint import Blueprint
from restful.exceptions import NotFoundException
from services.document_service import DocumentService
from utils.create_application_utils import (
    API_DOCKERFILE,
    DOCKER_COMPOSE,
    WEB_DOCKERFILE,
    generate_plugins,
    generate_plugins_readme,
    generate_runnable_file,
    strip_datasource,
    zip_all,
    zip_package,
)
from utils.create_entity_utils import create_entity
from utils.logging import logger


class ApplicationService:
    """
    Service for DMT specific features.
    Basic DMSS CRUD features resides in DocumentService.
    """

    def __init__(self, document_service: DocumentService = None):
        self.document_service: DocumentService = document_service if document_service else DocumentService()

    def get_related_blueprints(self, blueprint: str) -> dict:

        related_blueprints = {}

        first = self.document_service.get_blueprint(blueprint)
        related_blueprints[blueprint] = first.entity

        def get_blueprints_recursive(type: Blueprint):
            for attr in type.get_non_primitive_types():
                bp = self.document_service.get_blueprint(attr.attribute_type)
                related_blueprints[attr.attribute_type] = bp.entity
                if attr.attribute_type not in related_blueprints.keys():
                    get_blueprints_recursive(bp)

        for attr in first.get_non_primitive_types():
            bp = self.document_service.get_blueprint(attr.attribute_type)
            related_blueprints[attr.attribute_type] = bp.entity
            get_blueprints_recursive(bp)

        return related_blueprints

    def instantiate_entity(self, entity: dict):
        entity: dict = create_entity(self.document_service.get_blueprint, entity)
        return entity

    def create_application(self, data_source_id: str, application_id: str) -> io.BytesIO:
        raise NotImplementedError("Creating and exporting an application is no longer supported")
        application: dict = self.document_service.uid_document_provider(data_source_id, application_id)
        if not application:
            raise NotFoundException(f"The entity with id '{application_id}' was not found")

        home_path = Path(Config.APPLICATION_HOME)

        memory_file = io.BytesIO()
        with ZipFile(memory_file, mode="w") as zip_file:
            # TODO: These does not exist locally in DMT. Add from DMSS?
            # zip_all(zip_file, f"{home_path}/system/SIMOS", rel="api/home/applications/SIMOS")
            zip_all(zip_file, f"{home_path}/applications/DMT", real_name="api/home/applications/DMT")
            zip_all(zip_file, f"{home_path}/data_sources", real_name="api/home/data_sources")
            zip_all(zip_file, f"{home_path}/code_generators", real_name="api/home/code_generators")
            application.pop("_id", None)
            application.pop("uid", None)
            json_data = json.dumps(application)
            binary_data = json_data.encode()
            zip_file.writestr("api/home/settings.json", binary_data)
            runnable_file = generate_runnable_file(application["actions"])
            zip_file.writestr("web/actions.js", runnable_file)
            zip_file.writestr("docker-compose.yml", DOCKER_COMPOSE)
            zip_file.writestr("web/Dockerfile", WEB_DOCKERFILE)
            zip_file.writestr("api/Dockerfile", API_DOCKERFILE)
            zip_file.writestr("web/config.js", generate_plugins())
            zip_file.writestr("web/custom-plugins/README.md", generate_plugins_readme())

            for package in application["packages"]:
                logger.info(f"Add package: {package}")
                # TODO: Support including packages from different data sources
                # This is a temp. hack
                package = strip_datasource(package)
                root_package: dict = self.document_service.document_provider(f"{data_source_id}/{package}")
                zip_package(zip_file, root_package, "api/home/blueprints", self.document_service, data_source_id)

        memory_file.seek(0)
        return memory_file

import io
import json
from pathlib import Path
from zipfile import ZipFile

from domain_classes.blueprint import Blueprint
from domain_classes.dto import DTO
from config import Config
from repository.repository_exceptions import EntityNotFoundException
from utils.create_application_utils import (
    zip_all,
    generate_runnable_file,
    DOCKER_COMPOSE,
    WEB_DOCKERFILE,
    API_DOCKERFILE,
    generate_plugins,
    strip_datasource,
    zip_package,
    generate_plugins_readme,
)
from services.document_service import DocumentService
from utils.create_entity_utils import CreateEntity
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
        related_blueprints[blueprint] = first.to_dict()

        def get_blueprints_recursive(type: Blueprint):
            for attr in type.get_none_primitive_types():
                bp = self.document_service.get_blueprint(attr.attribute_type)
                related_blueprints[attr.attribute_type] = bp.to_dict()
                if attr.attribute_type not in related_blueprints.keys():
                    get_blueprints_recursive(bp)

        for attr in first.get_none_primitive_types():
            bp = self.document_service.get_blueprint(attr.attribute_type)
            related_blueprints[attr.attribute_type] = bp.to_dict()
            get_blueprints_recursive(bp)

        return related_blueprints

    def instantiate_entity(self, type: str, name: str = None):
        entity: dict = CreateEntity(
            self.document_service.blueprint_provider, name=name, type=type, description=""
        ).entity
        return entity

    def create_application(self, data_source_id: str, application_id: str) -> io.BytesIO:
        application: DTO = DTO(self.document_service.uid_document_provider(data_source_id, application_id))
        if not application:
            raise EntityNotFoundException(uid=application_id)

        home_path = Path(Config.APPLICATION_HOME)

        memory_file = io.BytesIO()
        with ZipFile(memory_file, mode="w") as zip_file:
            # TODO: These does not exist locally in DMT. Add from DMSS?
            # zip_all(zip_file, f"{home_path}/system/SIMOS", rel="api/home/applications/SIMOS")
            zip_all(zip_file, f"{home_path}/applications/DMT", real_name="api/home/applications/DMT")
            zip_all(zip_file, f"{home_path}/data_sources", real_name="api/home/data_sources")
            zip_all(zip_file, f"{home_path}/code_generators", real_name="api/home/code_generators")
            application.data.pop("_id", None)
            application.data.pop("uid", None)
            json_data = json.dumps(application.data)
            binary_data = json_data.encode()
            zip_file.writestr("api/home/settings.json", binary_data)
            runnable_file = generate_runnable_file(application.data["actions"])
            zip_file.writestr("web/actions.js", runnable_file)
            zip_file.writestr("docker-compose.yml", DOCKER_COMPOSE)
            zip_file.writestr("web/Dockerfile", WEB_DOCKERFILE)
            zip_file.writestr("api/Dockerfile", API_DOCKERFILE)
            zip_file.writestr("web/config.js", generate_plugins())
            zip_file.writestr("web/custom-plugins/README.md", generate_plugins_readme())

            for package in application.data["packages"]:
                logger.info(f"Add package: {package}")
                # TODO: Support including packages from different data sources
                # This is a temp. hack
                package = strip_datasource(package)
                root_package: DTO = DTO(self.document_service.document_provider(f"{data_source_id}/{package}"))
                zip_package(zip_file, root_package, "api/home/blueprints", self.document_service, data_source_id)

        memory_file.seek(0)
        return memory_file

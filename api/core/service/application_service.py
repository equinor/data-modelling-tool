import io
import json
from pathlib import Path
from zipfile import ZipFile

from classes.dto import DTO
from config import Config
from core.repository.repository_exceptions import EntityNotFoundException
from core.service.create_application_utils import zip_all, generate_runnable_file, DOCKER_COMPOSE, WEB_DOCKERFILE, \
    API_DOCKERFILE, generate_external_plugins, strip_datasource, zip_package
from core.service.document_service import DocumentService
from core.use_case.utils.create_entity import CreateEntity
from utils.logging import logger


class ApplicationService:
    def __init__(self, document_service: DocumentService = None):
        self.document_service = document_service if document_service else DocumentService()

    def instantiate_entity(self, type: str, name: str = None):
        entity: dict = CreateEntity(self.document_service.blueprint_provider, name=name, type=type, description="").entity
        return entity

    def create_application(self, data_source_id: str, application_id: str) -> io.BytesIO:
        application: DTO = DTO(self.document_service.get_by_uid(data_source_id, application_id).to_dict())
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
            zip_file.writestr("api/home/dmt_settings.json", json.dumps(Config.ENTITY_APPLICATION_SETTINGS).encode())
            zip_file.writestr("web/external-plugins/index.js", generate_external_plugins())

            for package in application.data["packages"]:
                logger.info(f"Add package: {package}")
                # TODO: Support including packages from different data sources
                # This is a temp. hack
                package = strip_datasource(package)
                root_package: DTO = DTO(self.document_service.get_by_path(data_source_id, package).to_dict())
                zip_package(zip_file, root_package, f"api/home/blueprints", self.document_service, data_source_id)

        memory_file.seek(0)
        return memory_file

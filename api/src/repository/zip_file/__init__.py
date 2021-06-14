import json
from zipfile import ZipFile

from domain_classes.dto import DTO
from enums import BLUEPRINTS
from repository.repository_interface import RepositoryInterface
from utils.logging import logger


class ZipFileClient(RepositoryInterface):
    def __init__(self, zip_file: ZipFile):
        self.zip_file = zip_file

    def update(self, dto: DTO):
        dto.data.pop("_id", None)
        dto.data.pop("uid", None)
        write_to = f"{dto.data['__path__']}/{dto.name}.json"
        dto.data.pop("__path__")
        json_data = json.dumps(dto.data)
        binary_data = json_data.encode()
        logger.info(f"Writing: {dto.type} to {write_to}")

        if dto.type != BLUEPRINTS.PACKAGE.value:
            self.zip_file.writestr(write_to, binary_data)

    def get(self, uid: str):
        raise NotImplementedError

    def add(self, uid: str, document: dict):
        raise NotImplementedError

    def delete(self, uid: str):
        raise NotImplementedError

    def find(self, filters):
        raise NotImplementedError

    def find_one(self, filters):
        raise NotImplementedError

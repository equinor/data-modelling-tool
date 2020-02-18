from typing import List, Union

from classes.dto import DTO
from core.repository.db_client_interface import DBClientInterface
from core.repository.repository_exceptions import EntityNotFoundException
from utils.logging import logger


class Repository:
    def __init__(self, name: str, db: DBClientInterface, document_type: str):
        self.name = name
        self.client = db
        self.document_type = document_type

    def get(self, uid: str) -> DTO:
        try:
            result = self.client.get(uid)
            return DTO(result)
        except Exception as error:
            logger.exception(error)
            raise EntityNotFoundException(f"the document with uid: {uid} was not found")

    def find(self, filter: dict, single: bool = True) -> Union[DTO, List[DTO]]:
        result = self.client.find(filter)
        if single:
            if result.count() == 1:
                return DTO(result[0])
            elif result.count() == 0:
                return None
            else:
                raise ValueError("More than one was found, and a single was requested")
        else:
            return [DTO(item) for item in result]

    def update(self, document: DTO) -> None:
        if (
            not document.name == document.data["name"]
            or not document.type == document.data["type"]
            or not document.uid == document.data["_id"]
        ):
            raise ValueError("The meta data and tha 'data' object in the DTO does not match!")
        self.client.update(document.uid, document.data)

    def add(self, document: DTO) -> None:
        self.client.add(document.uid, document.data)

    def delete(self, uid: str) -> None:
        self.client.delete(uid)

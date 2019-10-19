from typing import Dict

from core.domain.dto import DTO
from core.repository.mongo.mongo_repository_base import MongoRepositoryBase
from core.repository.interface.document_repository import DocumentRepository


class MongoDocumentRepository(MongoRepositoryBase, DocumentRepository):
    class Meta:
        data = Dict

    def __init__(self, db):
        super().__init__(db)

    def get(self, uid: str) -> DTO:
        result = self.client().get(uid)
        if result:
            return DTO(data=result, uid=uid, type=result["type"])

    def find(self, filter: dict):
        result = self.client().find_one(filter)
        if result:
            data = result
            data["uid"] = result["_id"]
            return DTO(data=data, uid=result["_id"], type=result["type"])

    def update(self, dto: DTO) -> None:
        if not isinstance(dto.data, dict):
            data = dto.data.to_dict()
        else:
            data = dto.data
        # flatten dto, keep back compability
        data["_id"] = dto.uid
        data["uid"] = dto.uid
        self.client().update(dto.uid, data)

    def add(self, dto: DTO) -> None:
        if isinstance(dto.data, dict):
            self.client().add(dto.uid, dto.data)
        else:
            self.client().add(dto.uid, dto.data.to_dict())

    def delete(self, document: DTO) -> None:
        self.client().delete(document.uid)

    def list(self):
        # return [D.from_dict(document) for document in self.c().find(filters={})]
        raise NotImplementedError

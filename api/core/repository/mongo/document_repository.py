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
            return DTO(data=result, uid=uid)

    def find(self, filter: dict):
        result = self.client().find_one(filter)
        if result:
            data = result
            data["uid"] = result["_id"]
            return DTO(data=data, uid=result["_id"])

    def update(self, document: DTO) -> None:
        data = document.data
        if not isinstance(data, dict):
            data = data.to_dict()
        # flatten dto, keep backward compatibility
        data["_id"] = document.uid
        data["uid"] = document.uid
        self.client().update(document.uid, data)

    def add(self, dto: DTO) -> None:
        data = dto.data
        if not isinstance(data, dict):
            data = data.to_dict()
        self.client().add(dto.uid, data)

    def delete(self, document: DTO) -> None:
        self.client().delete(document.uid)

    def list(self, filters):
        documents = self.client().find(filters=filters)
        return [DTO(r, uid=r["_id"]) for r in documents]

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
        result = self.c().get(uid)
        if result:
            return DTO(data=result, uid=uid, type=result["type"])

    def update(self, uid: str, data: Dict) -> None:
        # flatten dto, keep back compability
        data["_id"] = uid
        data["uid"] = uid
        self.c().update(uid, data)

    def add(self, dto: DTO) -> None:
        self.c().add(dto.uid, dto.data)  # .to_dict()"

    def delete(self, document: DTO) -> None:
        self.c().delete(document.uid)

    def list(self):
        # return [D.from_dict(document) for document in self.c().find(filters={})]
        raise NotImplementedError

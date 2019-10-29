from typing import List

from core.domain.blueprint import Blueprint
from core.domain.dto import DTO
from core.repository.mongo.mongo_repository_base import MongoRepositoryBase


class MongoBlueprintRepository(MongoRepositoryBase):
    class Meta:
        model = Blueprint

    def __init__(self, db):
        super().__init__(db)

    def get(self, uid: str) -> Blueprint:
        result = self.client().get(uid)
        if result:
            return self.convert_to_model(result)

    def update(self, document: Blueprint) -> None:
        self.client().update(document.uid, document.to_dict())

    def add(self, document: DTO) -> None:
        self.client().add(document.uid, document.data.to_dict())

    def delete(self, document: Blueprint) -> None:
        self.client().delete(document.uid)

    def list(self):
        return [Blueprint.from_dict(document) for document in self.client().find(filters={})]

    def find_one(self, name: str) -> Blueprint:
        filters = {"name": name}
        adict = self.client().find_one(filters=filters)
        if adict:
            return Blueprint.from_dict(adict)

    def find(self, name: str) -> List[Blueprint]:
        filters = {"name": name}
        result = []
        for item in self.client().find(filters=filters):
            result.append(Blueprint.from_dict(item))
        return result

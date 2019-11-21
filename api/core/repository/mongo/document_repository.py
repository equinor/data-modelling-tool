from core.enums import SIMOS
from core.repository.mongo.mongo_db_client import DbClient
from core.domain.dto import DTO
from core.repository.mongo.mongo_repository_base import MongoRepositoryBase


class MongoDocumentRepository(MongoRepositoryBase):
    def __init__(self, db: DbClient):
        super().__init__(db)

    def get(self, uid: str) -> DTO:
        result = self.client().get(uid)
        if result:
            if result["type"] == SIMOS.BLUEPRINT.value:
                return self.convert_to_model(result)
            else:
                return DTO(result)

    def find(self, filter: dict, single: bool = True, raw: bool = False):
        result = self.client().find(filter)
        if single:
            if result.count() == 1:
                return self._process(result[0], raw)
            elif result.count() == 0:
                return None
            else:
                raise ValueError("More than one was found, and a single was requested")
        else:
            return [self._process(item, raw) for item in result]

    def _process(self, result, raw: bool = False):
        if result:
            if raw:
                del result["_id"]
                return result
            data = result
            data["uid"] = result["_id"]
            return self.convert_to_model(data)

    def update(self, document: DTO) -> None:
        data = document.data
        if not isinstance(data, dict):
            data = data.to_dict()
        # flatten dto, keep backward compatibility
        data["_id"] = document.uid
        data["uid"] = document.uid
        self.client().update(document.uid, data)

    def add(self, document: DTO) -> None:
        data = document.data
        if not isinstance(data, dict):
            data = data.to_dict()
        self.client().add(document.uid, data)

    def delete(self, document: DTO) -> None:
        self.client().delete(document.uid)

    def list(self):
        # return [D.from_dict(document) for document in self.c().find(filters={})]
        raise NotImplementedError

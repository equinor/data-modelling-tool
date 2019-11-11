from abc import ABC
from typing import Any, Dict

from core.domain.dto import DTO
from core.domain.schema import Factory
from core.repository.interface.document_repository import DocumentRepository
from core.repository.mongo.mongo_db_client import DbClient


def strip_ids(item):
    if isinstance(item, dict):
        _item = {}
        for key, value in item.items():
            if key not in ["_id", "uid", "id"]:
                _item[key] = strip_ids(value)
        item = _item
    elif isinstance(item, list):
        item = [strip_ids(e) for e in item]
    return item


class MongoRepositoryBase(DocumentRepository, ABC):
    def __init__(self, db: DbClient):
        self.db = db
        self._template_generator = Factory(self)

    def _generate_template(self, template_type: str):
        return self._template_generator.create(template_type)

    def client(self) -> DbClient:
        return self.db

    def convert_to_model(self, dict_: Dict[str, Any]) -> DTO:

        model = self._generate_template(dict_["type"]).from_dict(dict_)
        return model

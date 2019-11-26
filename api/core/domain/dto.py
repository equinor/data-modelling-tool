from uuid import uuid4, UUID
from typing import TypeVar, Optional, Generic

from stringcase import snakecase

from utils.data_structure.find import get

T = TypeVar("T")


class DTO(Generic[T]):
    def __init__(self, data: T, uid: Optional[UUID] = None):
        for key in ["uid", "_id", "id"]:
            try:
                uid = get(data, key)
            except (KeyError, AttributeError, TypeError):
                pass
        if uid is None:
            uid = uuid4()
        self._uid = uid
        self._data = data

        if isinstance(self.data, dict):
            # remove when dto is stored in mongo documents.
            for key in ["uid", "_id"]:
                try:
                    del self._data[key]
                except KeyError:
                    pass

    @property
    def uid(self) -> str:
        return str(self._uid)

    @property
    def data(self) -> T:
        return self._data

    @data.setter
    def data(self, data: T):
        self._data = data

    def to_dict(self, include_defaults: bool = True):
        return {
            "uid": self.uid,
            "data": self.data if isinstance(self.data, dict) else self.data.to_dict(include_defaults=include_defaults),
        }

    def __getattr__(self, item: str):
        def get(name):
            try:
                return getattr(self.data, name)
            except AttributeError:
                return self.data[name]

        try:
            return get(item)
        except (KeyError, AttributeError, TypeError):
            return get(snakecase(item))

    def get_values(self, name):
        try:
            return self.__getattr__(name)
        except KeyError:
            return None

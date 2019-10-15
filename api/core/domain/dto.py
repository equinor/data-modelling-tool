from uuid import uuid4, UUID
from typing import Union, Dict, TypeVar, Optional

from stringcase import snakecase

T = TypeVar("T")


class DTO:
    # TODO: Make a Factory, tat takes document repository as input, and converts the dict to the appropriate class
    def __init__(self, data: Union[Dict, T], uid: Optional[UUID] = None, type: str = None):
        if uid is None:
            uid = uuid4()
        self._uid = str(uid)
        self._data = data
        self._type = type

        # remove when dto is stored in mongo documents.
        for key in ["uid", "_id"]:
            try:
                del self._data[key]
            except KeyError:
                pass

    @property
    def uid(self):
        return str(self._uid)

    @property
    def data(self) -> T:
        return self._data

    @property
    def type(self) -> str:
        return self._type

    def to_dict(self):
        return {"uid": self.uid, "data": self.data}

    def __getattr__(self, item):
        try:
            return self.data[item]
        except KeyError:
            return self.data[snakecase(item)]

    def get_values(self, name):
        try:
            return self.__getattr__(name)
        except KeyError:
            return None

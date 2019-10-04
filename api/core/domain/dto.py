from uuid import uuid4
from typing import Union, Dict, TypeVar

T = TypeVar("T")


class DTO:
    def __init__(self, data: Union[Dict, T], uid: None, type: str=None):
        if uid is None:
            uid = uuid4()
        self._uid = uid
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
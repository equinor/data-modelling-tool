from uuid import uuid4
from typing import Union, Dict, TypeVar

T = TypeVar("T")


class DTO:
    def __init__(self, data: Union[Dict, T], uid=None):
        if uid is None:
            uid = uuid4()
        self._uid = uid
        self._data = data

    @property
    def uid(self):
        return str(self._uid)

    @property
    def data(self) -> T:
        return self._data

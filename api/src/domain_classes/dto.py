from typing import Dict, Optional
from uuid import uuid4


# For backwards compatibility, data is not a private property.
# But to get and set any "non-standard" properties, use 'my_dto["my_key"]' instead of 'my_dto.data["my_key"]'.
# The goal is to encapsulate the 'data' dict in the DTO class
class DTO:
    def __init__(self, data: Dict, uid: Optional[str] = None):
        self._uid = uid if uid is not None else data.get("_id", str(uuid4()))
        self._name = data["name"]
        self._type = data["type"]
        self._attribute_type = data.get("attribute_type", "")
        self.data = data

    def get(self, key, default=None):
        if default is not None:
            return self.data.get(key, default)
        return self.data.get(key)

    def __getitem__(self, key):
        try:
            return self.data[key]
        except KeyError:
            raise KeyError(f"{self.name} has no key {key}")

    def __setitem__(self, key, value):
        if hasattr(self, key):
            setattr(self, f"_{key}", value)
            self.data[key] = value
        else:
            self.data[key] = value

    @property
    def name(self) -> str:
        return self._name

    def keys(self):
        return self.data.keys()

    @name.setter
    def name(self, value: str):
        self._name = value
        self.data["name"] = value

    @property
    def type(self) -> str:
        return self._type

    @property
    def attribute_type(self) -> str:
        return self._attribute_type

    @type.setter
    def type(self, value: str):
        self._type = value
        self._data["type"] = value

    @property
    def uid(self) -> str:
        return str(self._uid)

    def to_dict(self):
        return {"_id": self.uid, **self.data}

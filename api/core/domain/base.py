from uuid import uuid4


class Base:
    def __init__(self):
        self._uid = uuid4()

    @property
    def uid(self):
        return str(self._uid)

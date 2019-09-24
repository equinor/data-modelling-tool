from utils.enums import DataSourceType


# TODO: Make data_source types inherit this class
class DataSource:
    def __init__(self, id: str, host: str, name: str, type: DataSourceType):
        self.id = id
        self.host = host
        self.name = name
        self.type = type

    def to_dict(self):
        return {"id": self.id, "name": self.name, "host": self.host, "type": self.type}

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

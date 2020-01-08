from classes.data_source import DataSource
from core.repository import Repository
from core.repository.mongo import MongoDBClient
from core.enums import DataSourceType


def get_repository(data_source: DataSource):
    if data_source.type == DataSourceType.MONGO.value:
        return Repository(
            MongoDBClient(
                host=data_source.host,
                username=data_source.username,
                password=data_source.password,
                database=data_source.database,
                tls=data_source.tls,
                collection=data_source.collection,
                port=data_source.port,
            )
        )

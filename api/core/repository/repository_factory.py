from classes.data_source import DataSource
from core.enums import DataSourceType
from core.repository import Repository
from core.repository.mongo import MongoDBClient


def get_repository(data_source_id: str):
    data_source: DataSource = DataSource(uid=data_source_id)
    if data_source.type == DataSourceType.MONGO.value:
        return Repository(
            name=data_source.name,
            db=MongoDBClient(
                host=data_source.host,
                username=data_source.username,
                password=data_source.password,
                database=data_source.database,
                tls=data_source.tls,
                collection=data_source.collection,
                port=data_source.port,
            ),
            document_type=data_source.documentType,
        )

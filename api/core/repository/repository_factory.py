from core.repository.mongo.document_repository import MongoDocumentRepository
from core.repository.mongo.mongo_db_client import MongoDbClient
from core.enums import DataSourceType
from core.domain.data_source import DataSource


def get_repository(data_source: DataSource):
    if data_source.type == DataSourceType.MONGO.value:
        # Not sure if this is the correct place
        data_source = MongoDbClient(
            host=data_source.host,
            username=data_source.username,
            password=data_source.password,
            database=data_source.database,
            tls=data_source.tls,
            collection=data_source.collection,
            port=data_source.port,
        )

        return MongoDocumentRepository(data_source)

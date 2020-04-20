from core.enums import DataSourceType
from core.repository import Repository
from core.repository.mongo import MongoDBClient
from core.repository.repository_exceptions import RepositoryException
from services.data_modelling_document_service import datasource_api


def get_data_source(data_source_id: str):
    data_source = datasource_api.get_data_source(data_source_id)
    if not data_source:
        raise RepositoryException(f"Error: The data-source was not found. ID: {data_source_id}")

    if data_source["type"] == DataSourceType.MONGO.value:
        return Repository(
            name=data_source["name"],
            db=MongoDBClient(
                host=data_source["host"],
                username=data_source["username"],
                password=data_source["password"],
                database=data_source["database"],
                tls=data_source.get("tls", False),
                collection=data_source["collection"],
                port=data_source["port"],
            ),
            document_type=data_source["documentType"],
        )

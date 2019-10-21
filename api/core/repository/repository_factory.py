from enum import Enum

from core.repository.mongo.document_repository import MongoDocumentRepository
from core.repository.mongo.mongo_db_client import MongoDbClient
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository


# TODO: Make Enum
from core.repository.mongo.package_repository import MongoPackageRepository
from utils.enums import DataSourceType


class RepositoryType(Enum):
    DocumentRepository = "DocumentRepository"
    PackageRepository = "PackageRepository"
    BlueprintRepository = "BlueprintRepository"


def get_repository(repository_type: RepositoryType, data_source):
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

        if repository_type == RepositoryType.DocumentRepository:
            return MongoDocumentRepository(data_source)
        if repository_type == RepositoryType.BlueprintRepository:
            return MongoBlueprintRepository(data_source)
        if repository_type == RepositoryType.PackageRepository:
            return MongoPackageRepository(data_source)

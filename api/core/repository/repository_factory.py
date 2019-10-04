from core.repository.mongo.document_repository import MongoDocumentRepository
from core.repository.mongo.dto_repository import DocumentDtoRepository
from core.repository.mongo.mongo_db_client import MongoDbClient
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository


# TODO: Make Enum
from core.repository.mongo.package_repository import MongoPackageRepository


class RepositoryType(object):
    DocumentRepository = "DocumentRepository"
    PackageRepository = "PackageRepository"
    BlueprintRepository = "BlueprintRepository"
    DtoRepository = "DtoRepository"


def get_repository(repository_type: RepositoryType, db):
    # TODO: db.type as Enum
    if db.type == "mongo-db":
        # Not sure if this is the correct place
        db = MongoDbClient(
            host=db.host,
            username=db.username,
            password=db.password,
            database=db.database,
            tls=db.tls,
            collection=db.collection,
            port=db.port,
        )
        if repository_type == RepositoryType.DocumentRepository:
            return MongoDocumentRepository(db)
        if repository_type == RepositoryType.BlueprintRepository:
            return MongoBlueprintRepository(db)
        if repository_type == RepositoryType.PackageRepository:
            return MongoPackageRepository(db)
        if repository_type == RepositoryType.DtoRepository:
            return DocumentDtoRepository(db)

from core.repository.mongo.document_repository import MongoDocumentRepository
from core.repository.mongo.sub_package_repository import MongoSubPackageRepository
from core.repository.mongo.root_package_repository import MongoRootPackageRepository
from core.repository.mongo.mongo_db_client import MongoDbClient


class RepositoryType(object):
    DocumentRepository = "DocumentRepository"
    SubPackageRepository = "SubPackageRepository"
    RootPackageRepository = "RootPackageRepository"


def get_repository(repository_type: RepositoryType, db):
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
        if repository_type == RepositoryType.SubPackageRepository:
            return MongoSubPackageRepository(db)
        if repository_type == RepositoryType.RootPackageRepository:
            return MongoRootPackageRepository(db)

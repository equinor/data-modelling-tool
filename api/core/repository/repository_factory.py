from core.repository.mongo.document_repository import DocumentRepository
from core.repository.mongo.package_repository import PackageRepository
from core.repository.mongo.root_package_repository import RootPackageRepository


class RepositoryType(object):
    DocumentRepository = "DocumentRepository"
    PackageRepository = "PackageRepository"
    RootPackageRepository = "RootPackageRepository"


def get_repository(repository_type: RepositoryType, db):
    if db.type == "mongo-db":
        if repository_type == RepositoryType.DocumentRepository:
            return DocumentRepository(db)
        if repository_type == RepositoryType.PackageRepository:
            return PackageRepository(db)
        if repository_type == RepositoryType.RootPackageRepository:
            return RootPackageRepository(db)

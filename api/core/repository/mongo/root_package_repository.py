from core.domain.root_package import RootPackage
from core.repository.mongo.mongo_repository_base import MongoRepositoryBase
from typing import List
from classes.package_request import DocumentType


class RootPackageRepository(MongoRepositoryBase):
    class Meta:
        model = RootPackage

    def __init__(self, db):
        super().__init__(db)

    def list(self) -> List[RootPackage]:
        result = self.c().find(filter={"meta.documentType": DocumentType.ROOT_PACKAGE.value})
        return [RootPackage.from_dict(r) for r in result]

    def save(self, document: RootPackage, id: str) -> RootPackage:
        document.id = self.c().create_form(document.to_dict(), _id=id)
        return document

from core.domain.root_package import RootPackage
from core.repository.mongo.mongo_repository_base import MongoRepositoryBase
from typing import List
from classes.package_request import DocumentType
from core.repository.interface.root_package_repository import RootPackageRepository


class MongoRootPackageRepository(MongoRepositoryBase, RootPackageRepository):
    class Meta:
        model = RootPackage

    def __init__(self, db):
        super().__init__(db)

    def get(self, uid: str) -> RootPackage:
        result = self.c().get(uid)
        if result:
            return self.convert_to_model(result)

    def list(self) -> List[RootPackage]:
        root_packages = self.c().find(filters={"meta.documentType": DocumentType.ROOT_PACKAGE.value})
        return [RootPackage.from_dict(r) for r in root_packages]

    def add(self, root_package: RootPackage) -> None:
        self.c().add(root_package.to_dict())

    def update(self, root_package: RootPackage) -> None:
        raise NotImplementedError()

    def delete(self, root_package: RootPackage) -> None:
        self.c().delete(root_package.id)

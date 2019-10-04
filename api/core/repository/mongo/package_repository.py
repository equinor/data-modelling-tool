from core.domain.package import Package
from core.repository.mongo.mongo_repository_base import MongoRepositoryBase
from typing import List
from core.repository.interface.package_repository import PackageRepository


class MongoPackageRepository(MongoRepositoryBase, PackageRepository):
    class Meta:
        model = Package

    def __init__(self, db):
        super().__init__(db)

    def get(self, uid: str) -> Package:
        result = self.c().get(uid)
        if result:
            return self.convert_to_model(result)

    def list(self) -> List[Package]:
        root_packages = self.c().find(filters={"isRoot": True})
        return [Package.from_dict(r) for r in root_packages]

    def add(self, root_package: Package) -> None:
        self.c().add(root_package.to_dict())

    def update(self, root_package: Package) -> None:
        raise NotImplementedError()

    def delete(self, root_package: Package) -> None:
        self.c().delete(root_package.id)

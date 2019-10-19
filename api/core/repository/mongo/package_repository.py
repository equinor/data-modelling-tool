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
        result = self.client().get(uid)
        if result:
            return Package.from_dict(result)

    def list(self) -> List[Package]:
        root_packages = self.client().find(filters={"isRoot": True})
        return [Package.from_dict(r) for r in root_packages]

    def add(self, package: Package) -> None:
        self.client().add(package.uid, package.to_dict())

    def update(self, package: Package) -> None:
        self.client().update(package.uid, package.to_dict())

    def delete(self, package: Package) -> None:
        self.client().delete(package.id)

    def find(self, filter: dict):
        return self.client().find_one(filter)

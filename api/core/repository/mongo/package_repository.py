from core.domain.dto import DTO
from core.domain.package import Package
from core.repository.interface.document_repository import DocumentRepository
from core.repository.mongo.mongo_repository_base import MongoRepositoryBase
from typing import List


class MongoPackageRepository(MongoRepositoryBase, DocumentRepository[Package]):
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
        return [DTO(Package.from_dict(r), uid=r["_id"]) for r in root_packages]

    def add(self, dto: DTO) -> None:
        self.client().add(dto.uid, dto.data.to_dict())

    def update(self, package: Package) -> None:
        self.client().update(package.uid, package.to_dict())

    def delete(self, package: Package) -> None:
        self.client().delete(package.id)

    def find(self, filter: dict):
        return self.client().find_one(filter)

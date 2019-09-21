from core.domain.sub_package import SubPackage
from core.repository.mongo.mongo_repository_base import MongoRepositoryBase
from core.repository.interface.sub_package_repository import SubPackageRepository


class MongoSubPackageRepository(MongoRepositoryBase, SubPackageRepository):
    class Meta:
        model = SubPackage

    def __init__(self, db):
        super().__init__(db)

    def get(self, uid: str) -> SubPackage:
        result = self.c().get(uid)
        if result:
            return self.convert_to_model(result)

    def update(self, package: SubPackage) -> None:
        self.c().update(package.id, package.to_dict())

    def add(self, document: SubPackage) -> None:
        self.c().add(document.to_dict())

    def delete(self, sub_package: SubPackage) -> None:
        raise NotImplementedError()

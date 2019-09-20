from core.domain.package import SubPackage
from core.repository.mongo.mongo_repository_base import MongoRepositoryBase


class PackageRepository(MongoRepositoryBase):
    class Meta:
        model = SubPackage

    def __init__(self, db):
        super().__init__(db)

    def get_by_id(self, package_id: str) -> SubPackage:
        result = self.c().read_form(package_id)
        if result:
            return self.convert_to_model(result)

    def update(self, package_id: str, package: SubPackage) -> SubPackage:
        adict = package.to_dict()
        return self.c().update(adict, package_id)

    def save(self, document: SubPackage) -> SubPackage:
        document.id = self.c().create_form(document.to_dict())
        return document

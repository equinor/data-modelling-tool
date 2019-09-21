from core.domain.sub_package import SubPackage
from utils.logging import logger
from core.repository.interface.sub_package_repository import SubPackageRepository


class AddPackageToPackageUseCase:
    def __init__(self, sub_package_repository: SubPackageRepository):
        self.sub_package_repository = sub_package_repository

    def execute(self, parent_id: str, sub_package: SubPackage) -> SubPackage:
        package: SubPackage = self.sub_package_repository.get(parent_id)
        sub_package_id = package.add_subpackage(sub_package.meta.name)
        self.sub_package_repository.update(package)
        sub_package.id = sub_package_id
        self.sub_package_repository.add(sub_package)
        logger.info(f"Added sub package '{sub_package_id}' to package '{parent_id}'")
        return sub_package

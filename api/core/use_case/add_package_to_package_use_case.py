from core.domain.package import SubPackage
from utils.logging import logger


class AddPackageToPackageUseCase:
    def __init__(self, package_repository):
        self.package_repository = package_repository

    def execute(self, parent_id: str, sub_package: SubPackage) -> SubPackage:
        package: SubPackage = self.package_repository.get_by_id(parent_id)
        sub_package_id = package.add_subpackage(sub_package.meta.name)
        self.package_repository.update(parent_id, package)
        sub_package = self.package_repository.save(sub_package, sub_package_id)
        logger.info(f"Added sub package '{sub_package_id}' to package '{parent_id}'")
        return sub_package

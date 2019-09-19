from core.domain.package import SubPackage, PackageMeta, SubPackageData
from core.domain.root_package import RootPackage
from utils.logging import logger


class AddRootPackageUseCase:
    def __init__(self, package_repository, root_package_repository):
        self.package_repository = package_repository
        self.root_package_repository = root_package_repository

    def execute(self, root_package: RootPackage) -> RootPackage:

        # Create version
        latest_version_id = f"{root_package.meta.name}/1.0.0/package"
        latest_version_package: SubPackage = SubPackage(
            id=latest_version_id,
            meta=PackageMeta(
                name=f"{root_package.meta.name}-1.0.0",
                document_type="version",
                template_ref="templates/package-template",
            ),
            form_data=SubPackageData(title=root_package.meta.name, description=root_package.form_data.description),
        )
        self.package_repository.save(latest_version_package, latest_version_id)

        # Set latest version
        root_package.form_data.latest_version = latest_version_id

        root_package = self.root_package_repository.save(root_package, f"{root_package.meta.name}/package")
        logger.info(f"Added root package '{root_package.meta.name}'")
        return root_package

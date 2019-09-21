from core.domain.sub_package import SubPackage, SubPackageMeta, SubPackageData
from core.domain.root_package import RootPackage
from utils.logging import logger
from core.domain.sub_package import DocumentId
from core.repository.interface.sub_package_repository import SubPackageRepository
from core.repository.interface.root_package_repository import RootPackageRepository


class AddRootPackageUseCase:
    def __init__(self, sub_package_repository: SubPackageRepository, root_package_repository: RootPackageRepository):
        self.sub_package_repository = sub_package_repository
        self.root_package_repository = root_package_repository

    def execute(self, root_package: RootPackage) -> RootPackage:

        # Create version
        latest_version_id: DocumentId = DocumentId(f"{root_package.meta.name}/1.0.0/package")
        latest_version_package: SubPackage = SubPackage(
            id=latest_version_id,
            meta=SubPackageMeta(
                name=f"{root_package.meta.name}-1.0.0",
                document_type="version",
                template_ref="templates/package-template",
            ),
            form_data=SubPackageData(title=root_package.meta.name, description=root_package.form_data.description),
        )
        self.sub_package_repository.add(latest_version_package)

        # Set latest version
        root_package.form_data.latest_version = latest_version_id
        root_package.id = f"{root_package.meta.name}/package"

        self.root_package_repository.add(root_package)
        logger.info(f"Added root package '{root_package.id}'")
        return root_package

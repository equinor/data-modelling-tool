from core.domain.document import Document
from core.domain.package import SubPackage
from utils.logging import logger


class AddFileToPackageUseCase:
    def __init__(self, document_repository, package_repository):
        self.document_repository = document_repository
        self.package_repository = package_repository

    def execute(self, parent_id: str, document: Document) -> Document:
        package: SubPackage = self.package_repository.get_by_id(parent_id)
        document_id = package.add_file(document.meta.name)
        self.package_repository.update(parent_id, package)
        document = self.document_repository.save(document, document_id)
        logger.info(f"Added document '{document_id}' to package '{parent_id}'")
        return document

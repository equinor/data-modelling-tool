from core.domain.sub_package import SubPackage
from core.domain.root_package import RootPackage
from core.domain.document import Document
from core.repository.interface.sub_package_repository import SubPackageRepository
from core.repository.interface.document_repository import DocumentRepository
from typing import List


class Index:
    def __init__(self, data_source_id: str):
        self.data_source_id = data_source_id
        self.index = {}

    def _get_absolute_path(self, document_id):
        return f"{self.data_source_id}/{document_id}"

    def add_package(self, package: SubPackage):
        document_id = self._get_absolute_path(package.id)
        children = []
        for file in package.form_data.files:
            children.append(self._get_absolute_path(file))
        for subpackage in package.form_data.subpackages:
            children.append(self._get_absolute_path(subpackage))
        self.index[document_id] = {
            "id": document_id,
            "title": package.filename,
            "children": children,
            "nodeType": "root-package" if package.meta.document_type == "version" else package.meta.document_type,
        }

    def add_file(self, document: Document):
        document_id = self._get_absolute_path(document.id)
        self.index[document_id] = {"id": document_id, "nodeType": "file", "title": document.filename, "children": []}

    # TODO: Replace with data source entity
    def add_data_source(self, data_source_id: str, data_source_name: str, root_packages: List[RootPackage]):
        data_source = {
            "id": data_source_id,
            "title": data_source_name,
            "nodeType": "datasource",
            "children": [
                self._get_absolute_path(root_package.form_data.latest_version) for root_package in root_packages
            ],
        }
        self.index[data_source["id"]] = data_source

    def to_dict(self):
        return self.index


class CreateIndexUseCase:
    def __init__(
        self,
        root_package_repository,
        package_repository: SubPackageRepository,
        document_repository: DocumentRepository,
    ):
        self.root_package_repository = root_package_repository
        self.package_repository = package_repository
        self.document_repository = document_repository

    def _add_package(self, index: Index, package_id: str):
        package: SubPackage = self.package_repository.get(package_id)
        index.add_package(package)
        for file in package.form_data.files:
            document = self.document_repository.get(file)
            index.add_file(document)
        for sub_package in package.form_data.subpackages:
            self._add_package(index, sub_package)

    def execute(self, data_source_id: str, data_source_name: str) -> Index:
        index = Index(data_source_id=data_source_id)
        root_packages: List[RootPackage] = self.root_package_repository.list()
        for root_package in root_packages:
            self._add_package(index, root_package.form_data.latest_version)

        # index.add_data_source(data_source_id, data_source_name, root_packages)

        return index

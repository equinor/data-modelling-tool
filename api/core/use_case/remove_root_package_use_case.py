from core.repository.interface.root_package_repository import RootPackageRepository
from core.repository.repository_exceptions import EntityNotFoundException
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.repository.interface.sub_package_repository import SubPackageRepository
from core.repository.interface.document_repository import DocumentRepository
from core.domain.root_package import RootPackage


class RemoveRootPackageRequestObject(req.ValidRequestObject):
    def __init__(self, filename=None):
        self.filename = filename

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "filename" not in adict:
            invalid_req.add_error("filename", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(filename=adict.get("filename"))


class RemoveRootPackageUseCase(uc.UseCase):
    def __init__(
        self,
        document_repository: DocumentRepository,
        sub_package_repository: SubPackageRepository,
        root_package_repository: RootPackageRepository,
    ):
        self.document_repository = document_repository
        self.sub_package_repository = sub_package_repository
        self.root_package_repository = root_package_repository

    def _delete_package(self, uid: str):
        sub_package = self.sub_package_repository.get(uid)
        if not sub_package:
            raise Exception(f"The sub package, with id {uid}, was not found")
        for uid in sub_package.form_data.files:
            document = self.document_repository.get(uid)
            if not document:
                raise Exception(f"The file, with id {uid}, was not found")
            logger.info(f"Removed file '{uid}' from sub package '{sub_package.id}'")
            self.document_repository.delete(document)
        for uid in sub_package.form_data.subpackages:
            self._delete_package(uid)
        self.sub_package_repository.delete(sub_package)
        logger.info(f"Removed sub package '{sub_package.id}'")

    def process_request(self, request_object):
        filename: str = request_object.filename

        root_package: RootPackage = self.root_package_repository.get(filename)
        if not root_package:
            raise EntityNotFoundException(uid=filename)
        self._delete_package(root_package.form_data.latest_version)
        self.root_package_repository.delete(root_package)
        logger.info(f"Removed root package '{root_package.id}'")
        return res.ResponseSuccess(True)

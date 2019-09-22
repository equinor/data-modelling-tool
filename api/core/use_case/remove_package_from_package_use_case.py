from core.domain.sub_package import SubPackage
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.repository.interface.sub_package_repository import SubPackageRepository
from core.repository.interface.document_repository import DocumentRepository


class RemovePackageFromPackageRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, filename=None):
        self.parent_id = parent_id
        self.filename = filename

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if "filename" not in adict:
            invalid_req.add_error("filename", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return RemovePackageFromPackageRequestObject(parent_id=adict.get("parentId"), filename=adict.get("filename"))


class RemovePackageFromPackageUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository, sub_package_repository: SubPackageRepository):
        self.document_repository = document_repository
        self.sub_package_repository = sub_package_repository

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
        parent_id: str = request_object.parent_id
        filename: str = request_object.filename

        # Remove from parent
        parent_sub_package: SubPackage = self.sub_package_repository.get(parent_id)
        if not parent_sub_package:
            raise Exception(f"The parent, with id {parent_id}, was not found")
        parent_sub_package.remove_subpackage(filename)
        self.sub_package_repository.update(parent_sub_package)

        # Recursively delete all files and subpackages
        self._delete_package(filename)

        logger.info(f"Removed sub package '{filename}' from sub package '{parent_id}'")
        return res.ResponseSuccess(True)

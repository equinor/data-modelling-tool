from core.domain.sub_package import SubPackage
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.repository.interface.sub_package_repository import SubPackageRepository
from core.repository.interface.document_repository import DocumentRepository


class RemoveFileFromPackageRequestObject(req.ValidRequestObject):
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

        return RemoveFileFromPackageRequestObject(parent_id=adict.get("parentId"), filename=adict.get("filename"))


class RemoveFileFromPackageUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository, sub_package_repository: SubPackageRepository):
        self.document_repository = document_repository
        self.sub_package_repository = sub_package_repository

    def process_request(self, request_object):
        parent_id: str = request_object.parent_id
        filename: str = request_object.filename

        sub_package: SubPackage = self.sub_package_repository.get(parent_id)
        if not sub_package:
            raise Exception(f"The parent, with id {parent_id}, was not found")
        document_id = sub_package.remove_file(filename)
        self.sub_package_repository.update(sub_package)

        document = self.document_repository.get(filename)
        if not document:
            raise Exception(f"The document, with id {document_id}, was not found")
        self.document_repository.delete(document)

        logger.info(f"Removed document '{filename}' from sub package '{parent_id}'")
        return res.ResponseSuccess(True)

from core.domain.document import Document
from core.domain.package import SubPackage
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req


class AddFileToPackageRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, document=None):
        self.parent_id = parent_id
        self.document = document

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if "document" not in adict:
            invalid_req.add_error("document", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return AddFileToPackageRequestObject(
            parent_id=adict.get("parentId"), document=Document.from_dict(adict.get("document"))
        )


class AddFileToPackageUseCase(uc.UseCase):
    def __init__(self, document_repository, package_repository):
        self.document_repository = document_repository
        self.package_repository = package_repository

    def process_request(self, request_object):
        parent_id = request_object.parent_id
        document = request_object.document

        package: SubPackage = self.package_repository.get_by_id(parent_id)
        document_id = package.add_file(document.meta.name)
        self.package_repository.update(parent_id, package)
        document = self.document_repository.save(document, document_id)
        logger.info(f"Added document '{document_id}' to package '{parent_id}'")
        return res.ResponseSuccess(document)

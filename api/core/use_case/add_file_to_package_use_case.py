from core.domain.document import Document
from core.domain.package import SubPackage
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req


class AddFileToPackageRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, filename=None, template_ref=None):
        self.parent_id = parent_id
        self.filename = filename
        self.template_ref = template_ref

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if "filename" not in adict:
            invalid_req.add_error("filename", "is missing")

        if "templateRef" not in adict:
            invalid_req.add_error("templateRef", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return AddFileToPackageRequestObject(
            parent_id=adict.get("parentId"), filename=adict.get("filename"), template_ref=adict.get("templateRef")
        )


class AddFileToPackageUseCase(uc.UseCase):
    def __init__(self, document_repository, package_repository):
        self.document_repository = document_repository
        self.package_repository = package_repository

    def process_request(self, request_object):
        parent_id: str = request_object.parent_id
        filename: str = request_object.filename
        template_ref: str = request_object.template_ref

        sub_package: SubPackage = self.package_repository.get_by_id(parent_id)
        if not sub_package:
            raise Exception(f"The parent, with id {parent_id}, was not found")

        document_id = sub_package.add_file(filename)
        self.package_repository.update(parent_id, sub_package)
        document = Document(id=document_id, template_ref=template_ref)
        self.document_repository.save(document)

        logger.info(f"Added document '{document_id}' to package '{parent_id}'")
        return res.ResponseSuccess(document)

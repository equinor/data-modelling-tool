from core.domain.sub_package import SubPackage
from utils.logging import logger
from core.repository.interface.sub_package_repository import SubPackageRepository
from core.shared import response_object as res
from core.shared import request_object as req
from core.shared import use_case as uc


class AddPackageToPackageRequestObject(req.ValidRequestObject):
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

        return AddPackageToPackageRequestObject(
            parent_id=adict.get("parentId"), filename=adict.get("filename"), template_ref=adict.get("templateRef")
        )


class AddPackageToPackageUseCase(uc.UseCase):
    def __init__(self, sub_package_repository: SubPackageRepository):
        self.sub_package_repository = sub_package_repository

    def process_request(self, request_object):
        parent_id: str = request_object.parent_id
        filename: str = request_object.filename
        template_ref: str = request_object.template_ref

        sub_package: SubPackage = self.sub_package_repository.get(parent_id)
        if not sub_package:
            raise Exception(f"The parent, with id {parent_id}, was not found")
        sub_package_id = sub_package.add_subpackage(filename)
        self.sub_package_repository.update(sub_package)

        sub_package = SubPackage(id=sub_package_id, template_ref=template_ref, document_type="subpackage")
        self.sub_package_repository.add(sub_package)
        logger.info(f"Added sub package '{sub_package_id}' to package '{parent_id}'")
        return res.ResponseSuccess(sub_package)

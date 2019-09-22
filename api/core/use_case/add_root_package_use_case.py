from core.domain.sub_package import SubPackage, SubPackageMeta, SubPackageData
from core.domain.root_package import RootPackage
from utils.logging import logger
from core.domain.sub_package import DocumentId
from core.repository.interface.sub_package_repository import SubPackageRepository
from core.repository.interface.root_package_repository import RootPackageRepository
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req


class AddRootPackageRequestObject(req.ValidRequestObject):
    def __init__(self, filename=None, template_ref=None):
        self.filename = filename
        self.template_ref = template_ref

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "filename" not in adict:
            invalid_req.add_error("filename", "is missing")

        if "templateRef" not in adict:
            invalid_req.add_error("templateRef", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return AddRootPackageRequestObject(filename=adict.get("filename"), template_ref=adict.get("templateRef"))


class AddRootPackageUseCase(uc.UseCase):
    def __init__(self, sub_package_repository: SubPackageRepository, root_package_repository: RootPackageRepository):
        self.sub_package_repository = sub_package_repository
        self.root_package_repository = root_package_repository

    def process_request(self, request_object):
        filename: str = request_object.filename
        template_ref: str = request_object.template_ref

        # Create version
        latest_version_id: DocumentId = DocumentId(f"{filename}/1.0.0/package")
        latest_version_package: SubPackage = SubPackage(
            id=latest_version_id,
            meta=SubPackageMeta(
                name=f"{filename}-1.0.0", document_type="version", template_ref="templates/package-template"
            ),
            form_data=SubPackageData(title=filename),
        )
        self.sub_package_repository.add(latest_version_package)

        # Create root package
        root_package = RootPackage(id=f"{filename}/package", template_ref=template_ref)
        root_package.form_data.latest_version = latest_version_id

        self.root_package_repository.add(root_package)
        logger.info(f"Added root package '{root_package.id}'")
        return res.ResponseSuccess(root_package)

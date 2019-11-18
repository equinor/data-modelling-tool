from core.domain.dto import DTO
from core.domain.models import Package
from core.repository.interface.document_repository import DocumentRepository
from utils.logging import logger
from core.shared import response_object as res
from core.shared import request_object as req
from core.shared import use_case as uc


class AddRootPackageRequestObject(req.ValidRequestObject):
    def __init__(self, name=None, type=None):
        self.name = name
        self.type = type

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "name" not in adict:
            invalid_req.add_error("name", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(name=adict.get("name"), type=adict.get("type", "system/DMT/Package"))


class AddRootPackageUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object):
        name: str = request_object.name
        type: str = request_object.type

        package = Package(name=name, type=type, is_root=True)

        document: DTO[Package] = DTO(data=package)

        self.document_repository.add(document)

        logger.info(f"Added root package '{document.uid}'")

        return res.ResponseSuccess(document)

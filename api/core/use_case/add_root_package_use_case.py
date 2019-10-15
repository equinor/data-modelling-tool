from uuid import uuid4

from core.domain.dto import DTO
from core.domain.package import Package
from core.repository.interface.document_repository import DocumentRepository
from utils.logging import logger
from core.shared import response_object as res
from core.shared import request_object as req
from core.shared import use_case as uc


class AddRootPackageRequestObject(req.ValidRequestObject):
    def __init__(self, name=None):
        self.name = name

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "name" not in adict:
            invalid_req.add_error("name", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(name=adict.get("name"))


class AddRootPackageUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object):
        name: str = request_object.name

        package = Package(uid=str(uuid4()), name=name, is_root=True)

        document: DTO = DTO(data=package.to_dict())

        self.document_repository.add(document)

        logger.info(f"Added package '{package.uid}'")

        return res.ResponseSuccess(package)

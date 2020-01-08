from classes.dto import DTO
from core.repository import Repository
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from utils.logging import logger


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
    def __init__(self, document_repository: Repository):
        self.document_repository = document_repository

    def process_request(self, request_object):
        name: str = request_object.name
        type: str = request_object.type
        document: DTO = DTO(data={"name": name, "type": type, "isRoot": True})
        self.document_repository.add(document)
        logger.info(f"Added root package '{document.uid}'")

        return res.ResponseSuccess(document)

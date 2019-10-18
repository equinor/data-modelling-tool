from uuid import uuid4

from core.domain.dto import DTO
from core.domain.entity import Entity
from core.repository.mongo.document_repository import MongoDocumentRepository
from core.repository.mongo.package_repository import PackageRepository
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from utils.logging import logger


class AddEntityFileToPackageRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, name=None, type=None):
        self.parent_id = parent_id
        self.name = name
        self.type = type

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if "name" not in adict:
            invalid_req.add_error("name", "is missing")

        if "type" not in adict:
            invalid_req.add_error("type", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return AddEntityFileToPackageRequestObject(
            parent_id=adict.get("parentId"), name=adict.get("name"), type=adict.get("type")
        )


class AddEntityFileToPackageUseCase(uc.UseCase):
    def __init__(self, document_repository: MongoDocumentRepository, package_repository: PackageRepository):
        self.document_repository = document_repository
        self.package_repository = package_repository

    def process_request(self, request_object):
        parent_id: str = request_object.parent_id
        name: str = request_object.name
        type: str = request_object.type

        parent = self.package_repository.get(parent_id)
        if not parent:
            raise Exception(f"The parent, with id {parent_id}, was not found")

        uid = str(uuid4())
        file = Entity({"_id": uid, "uid": uid, "name": name, "type": type})

        parent.documents += [{"_id": file._id, "name": file.name, "type": file.type}]
        self.package_repository.update(parent)

        document = DTO(data=file.to_dict(), uid=file._id, type=file.type)
        self.document_repository.add(document)

        # todo: create instance of references

        logger.info(f"Added document '{document.uid}''")
        return res.ResponseSuccess(document)

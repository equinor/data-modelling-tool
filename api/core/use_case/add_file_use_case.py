from uuid import uuid4

from classes.data_source import DataSource
from core.domain.dto import DTO
from core.repository.interface.document_repository import DocumentRepository
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req


class AddFileRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, name=None, type=None, attribute=None, path=None, is_contained=None):
        self.parent_id = parent_id
        self.name = name
        self.type = type
        self.attribute = attribute
        self.path = path
        self.is_contained = is_contained

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if "name" not in adict:
            invalid_req.add_error("name", "is missing")

        if "type" not in adict:
            invalid_req.add_error("type", "is missing")

        if "isContained" not in adict:
            invalid_req.add_error("is contained", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(
            parent_id=adict.get("parentId"),
            name=adict.get("name"),
            type=adict.get("type"),
            attribute=adict.get("attribute", ""),
            path=adict.get("path", ""),
            is_contained=adict.get("isContained", ""),
        )


class AddFileUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository, get_repository, data_source: DataSource):
        self.document_repository = document_repository
        self.get_repository = get_repository
        self.data_source = data_source

    def process_request(self, request_object: AddFileRequestObject):
        parent_id: str = request_object.parent_id
        name: str = request_object.name
        type: str = request_object.type
        attribute: str = request_object.attribute
        is_contained = request_object.is_contained == "true"

        parent: DTO = self.document_repository.get(parent_id)
        if not parent:
            raise Exception(f"The parent, with id {parent_id}, was not found")

        file = DTO(uid=uuid4(), data={"name": name, "description": "", "type": type})

        data = parent.data
        if attribute not in data:
            data[attribute] = []

        if is_contained:
            data[attribute] += [file.data]
        else:
            data[attribute] += [{"type": "ref", "_id": file.uid, "name": name}]

        self.document_repository.update(parent.uid, data)
        self.document_repository.add(file)

        logger.info(f"Added document '{file.uid}''")
        return res.ResponseSuccess(file)

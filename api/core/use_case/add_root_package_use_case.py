from classes.dto import DTO
from core.enums import DMT
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from services.data_modelling_document_service import explorer_api
from utils.logging import logger


class AddRootPackageRequestObject(req.ValidRequestObject):
    def __init__(self, name=None):
        self.name = name

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "name" not in adict or len(adict["name"]) == 0:
            invalid_req.add_error("name", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(name=adict.get("name"))


class AddRootPackageUseCase(uc.UseCase):
    def __init__(self, data_source_id):
        self.data_source_id = data_source_id

    def process_request(self, request_object):
        name: str = request_object.name
        document: DTO = DTO(data={"name": name, "type": DMT.PACKAGE.value, "isRoot": True, "content": []})
        explorer_api.add_document(self.data_source_id, document)
        logger.info(f"Added root package '{document.uid}'")

        return res.ResponseSuccess(document)

from typing import Dict
from uuid import uuid4
from core.domain.dto import DTO
from core.use_case.utils.get_template import get_blueprint
from jsonschema import validate, ValidationError
from core.shared import request_object as req
from core.shared import use_case as uc
from utils.form_to_schema import form_to_schema
from utils.logging import logger
from core.shared import response_object as res


class AddDocumentRequestObject(req.ValidRequestObject):
    def __init__(self, data=None):
        self.data = data

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "data" not in adict:
            invalid_req.add_error("data", "is missing")
        else:
            data = adict["data"]
            if "name" not in data:
                invalid_req.add_error("name", "is missing")

            if "type" not in data:
                invalid_req.add_error("type", "is missing")

            if invalid_req.has_errors():
                return invalid_req

        return cls(data=adict.get("data"))


class AddDocumentUseCase(uc.UseCase):
    def __init__(self, document_repo):
        self.document_repo = document_repo

    def process_request(self, request_object: AddDocumentRequestObject):
        data: Dict = request_object.data

        document: DTO = DTO(uid=uuid4(), data=data, type=data["type"])

        if not document.type:
            raise Exception("The requested document does not contain a template reference")

        blueprint = get_blueprint(document.type)

        try:
            validate(instance=document.data, schema=form_to_schema(blueprint, None))
        except ValidationError as error:
            raise error

        self.document_repo.add(document)

        logger.info(f"Added document '{document.uid}''")

        return res.ResponseSuccess(document)

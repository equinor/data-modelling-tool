from core.enums import PRIMITIVES
from core.repository.repository_factory import get_repository
from core.service.document_service import DocumentService
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.utility import get_document_by_ref, get_blueprint
from dotted.collection import DottedDict

from classes.blueprint_attribute import BlueprintAttribute
from classes.dto import DTO
from utils.logging import logger


class GetDocumentRequestObject(req.ValidRequestObject):
    def __init__(self, data_source_id, document_id, ui_recipe, attribute):
        self.data_source_id = data_source_id
        self.document_id = document_id
        self.ui_recipe = ui_recipe
        self.attribute = attribute

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "data_source_id" not in adict:
            invalid_req.add_error("data_source_id", "is missing")

        if "document_id" not in adict:
            invalid_req.add_error("document_id", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(
            data_source_id=adict.get("data_source_id"),
            document_id=adict.get("document_id"),
            ui_recipe=adict.get("ui_recipe"),
            attribute=adict.get("attribute"),
        )


class GetDocumentUseCase(uc.UseCase):
    def __init__(self, repository_provider=get_repository):
        self.repository_provider = repository_provider

    def process_request(self, request_object: GetDocumentRequestObject):
        data_source_id: str = request_object.data_source_id
        document_id: str = request_object.document_id
        attribute: str = request_object.attribute

        document_service = DocumentService(repository_provider=self.repository_provider)

        document = document_service.get_by_uid(data_source_id=data_source_id, document_uid=document_id)

        data = document.to_dict()

        if attribute:
            dotted_data = DottedDict(data)
            data = dotted_data[attribute].to_python()

        if "_id" in data:
            document = document_service.get_by_uid(data_source_id=data_source_id, document_uid=data["_id"])
            data = document.to_dict()

        blueprint = get_blueprint(data["type"])

        children = []
        dtos = []
        self.add_children_types(children, dtos, blueprint)

        return res.ResponseSuccess(
            {"blueprint": blueprint.to_dict(), "document": data, "children": children, "dtos": dtos}
        )

    # todo control recursive iterations iterations, decided by plugin?
    def add_children_types(self, children, dtos, blueprint):
        for attribute in blueprint.attributes:
            attribute_type = attribute.attribute_type
            self.add_dtos(dtos, attribute)
            if attribute_type not in PRIMITIVES:
                # prevent infinite recursion.
                child_blueprint_name = attribute_type.split("/")[-1]
                type_in_children = next((x for x in children if x["name"] == child_blueprint_name), None)
                if not type_in_children:
                    child_blueprint = get_blueprint(attribute_type)
                    if not isinstance(child_blueprint, (dict, type(None))):
                        children.append(child_blueprint.to_dict())
                        self.add_children_types(children, dtos, child_blueprint)

    def add_dtos(self, dtos, attribute: BlueprintAttribute):
        if attribute.enum_type and len(attribute.enum_type) > 0:
            try:
                enum_blueprint: DTO = get_document_by_ref(attribute.enum_type)
                dtos.append(enum_blueprint.to_dict())
            except AttributeError as error:
                logger.exceptions(error)
                print(f"failed to append enumType {attribute}")
            except Exception as error:
                logger.exceptions(error)
                print(f"failed to append enumType {attribute}")

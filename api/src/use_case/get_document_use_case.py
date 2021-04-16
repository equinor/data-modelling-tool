from domain_classes.blueprint_attribute import BlueprintAttribute
from domain_classes.tree_node import Node
from enums import PRIMITIVES
from services.document_service import DocumentService
from restful import request_object as req
from restful import response_object as res
from restful import use_case as uc
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


class GetDMTDocumentUseCase(uc.UseCase):
    def __init__(self):
        self.document_service = DocumentService()

    def process_request(self, request_object: GetDocumentRequestObject):
        data_source_id: str = request_object.data_source_id
        document_id: str = request_object.document_id
        attribute: str = request_object.attribute

        document: Node = self.document_service.get_node_by_uid(data_source_id=data_source_id, document_uid=document_id)

        if attribute:
            document = document.get_by_path(attribute.split("."))

        blueprint = document.blueprint

        children = []
        dtos = []
        self.add_children_types(children, dtos, blueprint)

        return res.ResponseSuccess(
            {"blueprint": blueprint.to_dict_raw(), "document": document.to_dict(), "children": children, "dtos": dtos}
        )

    # TODO: Rewrite to use TreeNode. NO custom document recursion
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
                    child_blueprint = self.document_service.blueprint_provider.get_blueprint(attribute_type)
                    if not isinstance(child_blueprint, (dict, type(None))):
                        children.append(child_blueprint.to_dict())
                        self.add_children_types(children, dtos, child_blueprint)

    def add_dtos(self, dtos, attribute: BlueprintAttribute):
        if attribute.enum_type and len(attribute.enum_type) > 0:
            try:
                dtos.append(self.document_service.document_provider(attribute.enum_type))
            except AttributeError as error:
                logger.exception(error)
                print(f"failed to append enumType {attribute}")
            except Exception as error:
                logger.exception(error)
                print(f"failed to append enumType {attribute}")

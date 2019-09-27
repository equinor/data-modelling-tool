from uuid import uuid4

from classes.data_source import DataSource
from core.domain.blueprint import Blueprint
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.use_case.generate_index_use_case import Tree, Index, print_tree
from anytree import PreOrderIter


class AddFileRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, filename=None, template_ref=None, attribute=None, path=None):
        self.parent_id = parent_id
        self.filename = filename
        self.template_ref = template_ref
        self.attribute = attribute
        self.path = path

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if "filename" not in adict:
            invalid_req.add_error("filename", "is missing")

        if "templateRef" not in adict:
            invalid_req.add_error("templateRef", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(
            parent_id=adict.get("parentId"),
            filename=adict.get("filename"),
            template_ref=adict.get("templateRef"),
            attribute=adict.get("attribute", ""),
            path=adict.get("path", ""),
        )


class AddFileUseCase(uc.UseCase):
    def __init__(self, document_repository: MongoBlueprintRepository, get_repository, data_source: DataSource):
        self.document_repository = document_repository
        # self.data_source = data_source
        self.get_repository = get_repository
        self.data_source = data_source

    def process_request(self, request_object: AddFileRequestObject):
        parent_id: str = request_object.parent_id
        filename: str = request_object.filename
        template_ref: str = request_object.template_ref
        attribute: str = request_object.attribute
        path: str = request_object.path

        parent: Blueprint = self.document_repository.get(parent_id)
        if not parent:
            raise Exception(f"The parent, with id {parent_id}, was not found")

        file = Blueprint(
            uid=str(uuid4()), name=filename.replace(".json", ""), description="", template_ref=template_ref
        )

        # TODO: Get the storage recipe here and use it?
        if attribute not in parent.form_data:
            parent.form_data[attribute] = []

        # TODO: Start using type only
        parent.form_data[attribute] += [{"type": template_ref, "value": f"{path}/{file.name}", "name": file.name}]
        self.document_repository.update(parent)
        self.document_repository.add(file)

        tree = Tree(get_repository=self.get_repository, blueprint_repository=self.document_repository)
        root_node = tree.generate(
            data_source_id=self.data_source.id, data_source_name=self.data_source.name, document=file
        )
        print_tree(root_node)

        index = Index(data_source_id=self.data_source.id)
        for node in PreOrderIter(root_node):
            adict = node.to_node()
            if adict["id"] != self.data_source.id:
                index.add(adict)

        logger.info(f"Added document '{file.uid}''")
        return res.ResponseSuccess(index.to_dict())

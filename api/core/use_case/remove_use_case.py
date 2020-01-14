from classes.dto import DTO
from core.repository import Repository
from core.repository.repository_exceptions import EntityNotFoundException
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.use_case.utils.get_document_children import get_document_children
from utils.logging import logger


class RemoveFileRequestObject_v2(req.ValidRequestObject):
    def __init__(self, parent_id=None, document_id=None):
        self.parent_id = parent_id
        self.document_id = document_id

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "documentId" not in adict:
            invalid_req.add_error("documentId", "is missing")

        if "parentId" not in adict:
            invalid_req.add_error("parentId", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(parent_id=adict.get("parentId"), document_id=adict.get("documentId"))


def remove_key_from_dto_data(key_path: list, data: dict) -> None:
    if len(key_path) == 1:
        if isinstance(data, list):
            data.pop(int(key_path[0]))
        elif isinstance(data, dict):
            del data[key_path[0]]
        return
    if isinstance(data, list):
        remove_key_from_dto_data(key_path, data[int(key_path.pop(0))])
    elif isinstance(data, dict):
        remove_key_from_dto_data(key_path, data[key_path.pop(0)])


def remove_ref_from_parent(key_path: list, parent_data: dict, ref_id: str) -> None:
    if len(key_path) == 1:
        key = key_path[0]
        if isinstance(parent_data[key], list):
            for index, ref in enumerate(parent_data[key]):
                if ref["_id"] == ref_id:
                    parent_data[key].pop(index)
                    break
        elif isinstance(parent_data[key], dict):
            raise Exception("Not implemented yet!")
        return
    if isinstance(parent_data, list):
        remove_ref_from_parent(key_path, parent_data[int(key_path.pop(0))], ref_id)
    elif isinstance(parent_data, dict):
        remove_ref_from_parent(key_path, parent_data[key_path.pop(0)], ref_id)


class RemoveUseCase_v2(uc.UseCase):
    def __init__(self, document_repository: Repository):
        self.document_repository = document_repository

    def process_request(self, request_object):
        document_id: str = request_object.document_id
        parent_id: str = request_object.parent_id
        split_document_id = document_id.split(".")

        # TODO: Can we avoid fetching the document here in some cases. F.eks when deleting a whole document.
        document: DTO = self.document_repository.get(split_document_id[0])
        if not document:
            raise EntityNotFoundException(uid=split_document_id[0])

        if parent_id:
            split_parent = parent_id.split(".")
            # If the attribute is in the same document. Just pop the attribute node.
            if split_document_id[0] == split_parent[0]:
                key_to_remove = split_document_id[1:]
                remove_key_from_dto_data(key_to_remove, document.data)
                self.document_repository.update(document)
            # If it's not the same parent. We need to delete a reference as well as the document.
            else:
                # Remove reference from parent
                parent: DTO = self.document_repository.get(split_parent[0])
                if not parent:
                    raise EntityNotFoundException(uid=parent_id)
                remove_ref_from_parent(split_parent[1:], parent.data, document_id)
                self.document_repository.update(parent)

                # Remove the actual document
                self.document_repository.delete(document.uid)

                # Remove children of the document
                children = get_document_children(document, self.document_repository)
                for child in children:
                    self.document_repository.delete(child.uid)
                    logger.info(f"Removed child document '{child.uid}'")
        else:
            # Remove a node without any parent(root package)
            self.document_repository.delete(document.uid)

            # Remove children of the document
            children = get_document_children(document, self.document_repository)
            for child in children:
                self.document_repository.delete(child.uid)
                logger.info(f"Removed child document '{child.uid}'")

        logger.info(f"Removed document '{document.uid}'")
        return res.ResponseSuccess(True)

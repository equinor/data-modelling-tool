from pathlib import Path
from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.repository.interface.document_repository import DocumentRepository


class RemovePackageFromPackageRequestObject(req.ValidRequestObject):
    def __init__(self, filename=None):
        self.filename = filename

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "filename" not in adict:
            invalid_req.add_error("filename", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return RemovePackageFromPackageRequestObject(filename=adict.get("filename"))


class RemovePackageFromPackageUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object):
        filename: str = request_object.filename

        target: Path = Path(filename)
        path = str(target.parent) if str(target.parent) != "." else ""
        document = self.document_repository.get_by_path_and_filename(path=f"/{path}", filename=target.name)

        if not document:
            raise Exception(f"The folder, with id {document.uid}, was not found")
        self.document_repository.delete(document)

        start = "" if document.path == "/" else document.path
        children = (
            self.document_repository.get_nodes(f"{start}/{document.filename}", direct_descendants_only=False)
            if document.type == "folder"
            else []
        )
        for child in children:
            self.document_repository.delete(child)
            logger.info(f"Removed document '{child.uid}'")

        logger.info(f"Removed document '{filename}'")
        return res.ResponseSuccess({"removedChildren": [child.uid for child in children]})

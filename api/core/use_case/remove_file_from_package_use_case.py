from pathlib import Path

from utils.logging import logger
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req
from core.repository.interface.document_repository import DocumentRepository


class RemoveFileFromPackageRequestObject(req.ValidRequestObject):
    def __init__(self, parent_id=None, filename=None):
        self.parent_id = parent_id
        self.filename = filename

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "filename" not in adict:
            invalid_req.add_error("filename", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return RemoveFileFromPackageRequestObject(filename=adict.get("filename"))


class RemoveFileFromPackageUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def process_request(self, request_object):
        filename: str = request_object.filename
        target: Path = Path(filename)

        document = self.document_repository.get_by_path_and_filename(
            path=f"/{str(target.parent)}", filename=target.name
        )
        if not document:
            raise Exception(f"The document, with id {document.uid}, was not found")
        self.document_repository.delete(document)

        logger.info(f"Removed document '{filename}'")
        return res.ResponseSuccess(True)

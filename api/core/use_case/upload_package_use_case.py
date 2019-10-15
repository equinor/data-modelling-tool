from pathlib import Path
from typing import List, Union, Any, Dict
from uuid import uuid4

from core.domain.document import Document
from core.repository.interface.document_repository import DocumentRepository
from utils.logging import logger
from core.shared import response_object as res
from core.shared import request_object as req
from core.shared import use_case as uc


class UploadFileRequestObject(req.ValidRequestObject):
    def __init__(self, path: str, data: Dict[str, Any]):
        self.path = path
        self.data = data

    @property
    def base_path(self) -> Path:
        path = self.path
        suffix = ".json"
        if path.endswith(suffix):
            path = path[: -len(suffix)]
        if path.endswith(self.name):
            path = path[: -len(self.name)]
        path = path.rstrip("/")
        if not path.startswith("/"):
            path = f"/{path}"
        return Path(path)

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()
        for key, error in [
            ("path", None),
            ("type", None),
            ("name", None),
            ("description", None),
            ("attributes", None),
            # ("storageRecipe", None),
        ]:
            if key not in adict:
                invalid_req.add_error(key, error if error is not None else "is missing from one of the files")

        if invalid_req.has_errors():
            return invalid_req
        return cls(path=adict["path"], data=adict)


class UploadPackageRequestObject(req.ValidRequestObject):
    def __init__(self, files: List[UploadFileRequestObject]):
        self.files = files

    @classmethod
    def from_dict(cls, alist):
        files = []

        for adict in alist:
            request = UploadFileRequestObject.from_dict(adict)
            if isinstance(request, req.InvalidRequestObject) and request.has_errors():
                return request
            files.append(request)

        return cls(files=files)


# FIXME: Use the dynamic classes for validation, and so forth
class UploadPackageUseCase(uc.UseCase):
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def add_document(self, path: Union[Path, str], filename: str, type: str, form_data=None):
        item = Document(uid=str(uuid4()), filename=filename, type=type, path=str(path))
        if form_data:
            item.form_data = form_data
        self.document_repository.add(item)
        logger.info(f"Added {type} '{item.uid}' to package '{item.path}'")
        return item

    def exists(self, path: Union[Path, str], filename: str) -> bool:
        return self.document_repository.get_by_path_and_filename(str(path), filename) is None

    def process_request(self, request_object: UploadPackageRequestObject):
        created = []

        for file in request_object.files:
            filename: str = file.name
            template_type: str = file.type
            path = file.base_path
            if self.exists(path, path.name):
                _path = Path("/")
                for directory in path.parts:
                    if not directory or directory == "/":
                        continue
                    if self.exists(_path, directory):
                        created.append(self.add_document(_path, directory, template_type, type="folder"))
                    _path = _path / directory
            created.append(self.add_document(path, filename, template_type, type="file", form_data=file.form_data))

        return res.ResponseSuccess(created)

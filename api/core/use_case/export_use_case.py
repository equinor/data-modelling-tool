# flake8: noqa: F401

from config import Config
from classes.dto import DTO
from classes.storage_recipe import StorageRecipe
from core.repository import Repository
from core.repository.repository_exceptions import EntityNotFoundException
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
import zipfile
import io
import pathlib
import json
import os

from core.enums import DMT
from core.use_case.create_application_use_case import zip_package
from core.use_case.utils.get_blueprint import get_blueprint
from jinja2 import Template
from classes.blueprint import get_none_primitive_types


class ExportRequestObject(req.ValidRequestObject):
    def __init__(self, document_id=None):
        self.document_id = document_id

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "documentId" not in adict:
            invalid_req.add_error("documentId", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(document_id=adict.get("documentId"))


class ExportUseCase(uc.UseCase):
    def __init__(self, document_repository: Repository):
        self.document_repository = document_repository

    def process_request(self, request_object: ExportRequestObject):
        document_id: str = request_object.document_id

        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, mode="w") as zip_file:
            root_package: DTO = self.document_repository.get(document_id)
            zip_package(zip_file, root_package, self.document_repository, f"{root_package.name}/")

        memory_file.seek(0)

        return res.ResponseSuccess(memory_file)

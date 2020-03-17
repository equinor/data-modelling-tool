# flake8: noqa: F401

import io
import json
import os
import pathlib
import zipfile

from jinja2 import Template

from classes.dto import DTO
from classes.storage_recipe import StorageRecipe
from config import Config
from core.enums import DMT
from core.repository import Repository
from core.repository.repository_exceptions import EntityNotFoundException
from core.service.document_service import DocumentService
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
from core.use_case.create_application_use_case import zip_package


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
    def __init__(self, repository_provider, data_source_id):
        self.document_service = DocumentService(repository_provider=repository_provider)
        self.data_source_id = data_source_id

    def process_request(self, request_object: ExportRequestObject):
        document_id: str = request_object.document_id
        memory_file = self.document_service.create_zip_export(self.data_source_id, document_id)
        return res.ResponseSuccess(memory_file)

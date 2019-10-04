from core.domain import DocumentDto
from core.domain.blueprint import Blueprint
from core.domain.document import Document
from dotted.collection import DottedDict

from core.repository.mongo.blueprint_repository import MongoBlueprintRepository
from core.repository.mongo.dto_repository import DocumentDtoRepository


class UpdateDocumentUseCase:
    def __init__(self, dto_repository: DocumentDtoRepository):
        self.dto_repository = dto_repository

    def execute(self, document_id: str, form_data: dict, attribute_path: str = None) -> Document:
        dto: DocumentDto = self.dto_repository.get(document_id)
        self.dto_repository.update(dto["uid"], form_data)
        # TODO: This is just a hack right now, but should be changed to understand storage recipes
        # if attribute_path:
        #     obj = DottedDict({attribute_path: None} if not documentExcisting.form_data else documentExcisting.form_data)
        #     if isinstance(form_data, list):
        #         if attribute_path in obj:
        #             old_data = []
        #             try:
        #                 obj[attribute_path].to_python()
        #             except Exception as error:
        #                 print("Could not convert", error)
        #
        #             obj[attribute_path] = old_data + form_data
        #         else:
        #             obj[attribute_path] = form_data
        #     else:
        #         obj[attribute_path] = form_data
        #
        #     documentExcisting.form_data = obj.to_python()
        # else:
        #     documentExcisting.form_data = form_data

        # self.document_repository.update(documentExcisting)
        # form_data["_id"] = document_id
        return form_data

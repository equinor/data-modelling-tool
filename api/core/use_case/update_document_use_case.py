from core.domain.blueprint import Blueprint
from core.domain.document import Document
from dotted.collection import DottedDict

from core.repository.mongo.blueprint_repository import MongoBlueprintRepository


class UpdateDocumentUseCase:
    def __init__(self, document_repository: MongoBlueprintRepository):
        self.document_repository = document_repository

    def execute(self, document_id: str, form_data: dict, attribute_path: str = None) -> Document:
        document: Blueprint = self.document_repository.get(document_id)

        # TODO: This is just a hack right now, but should be changed to understand storage recipes
        if attribute_path:
            obj = DottedDict({attribute_path: None} if not document.form_data else document.form_data)
            if isinstance(form_data, list):
                if attribute_path in obj:
                    old_data = []
                    try:
                        obj[attribute_path].to_python()
                    except Exception as error:
                        print("Could not convert", error)

                    obj[attribute_path] = old_data + form_data
                else:
                    obj[attribute_path] = form_data
            else:
                obj[attribute_path] = form_data

            document.form_data = obj.to_python()
        else:
            document.form_data = form_data

        self.document_repository.update(document)
        return document

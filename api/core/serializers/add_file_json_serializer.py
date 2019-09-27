import json
from core.domain.document import Document


class AddFileSerializer(json.JSONEncoder):
    def default(self, document: Document):
        try:
            to_serialize = {
                "id": document.uid,
                "filename": document.name,
                # "documentType": document.type,
                # "path": document.path,
            }
            return to_serialize
        except AttributeError:
            return super().default(document)

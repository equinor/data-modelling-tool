import json
from core.domain.document import Document


class AddFileSerializer(json.JSONEncoder):
    def default(self, document: Document):
        try:
            to_serialize = {
                "id": document.id,
                "filename": document.filename,
                "documentType": document.meta.document_type,
            }
            return to_serialize
        except AttributeError:
            return super().default(document)

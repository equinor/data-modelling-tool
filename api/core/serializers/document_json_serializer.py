import json


class DocumentSerializer(json.JSONEncoder):
    def default(self, o):
        try:
            to_serialize = {"meta": o.meta, "formData": o.formData}
            return to_serialize
        except AttributeError:
            return super().default(o)

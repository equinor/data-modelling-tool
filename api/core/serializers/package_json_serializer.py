import json


class PackageSerializer(json.JSONEncoder):
    def default(self, o):
        try:
            to_serialize = {"title": str(o.title)}
            return to_serialize
        except AttributeError:
            return super().default(o)

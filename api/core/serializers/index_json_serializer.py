import json


class IndexSerializer(json.JSONEncoder):
    def default(self, o):
        try:
            to_serialize = {"index": o.index}
            return to_serialize
        except AttributeError:
            return super().default(o)

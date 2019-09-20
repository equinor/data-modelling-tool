class Template:
    def __init__(self, meta=None, schema=None):
        self.meta = meta
        self.schema = schema

    def validate(self):
        pass

    @classmethod
    def from_dict(cls, adict):
        return cls(meta=adict["meta"], schema=adict["schema"])

    def to_dict(self):
        return {"meta": self.meta, "schema": self.schema}

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

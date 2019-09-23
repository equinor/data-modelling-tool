class Template:
    def __init__(self, meta=None, schema=None, uiSchema=None, view=None):
        self.meta = meta
        self.schema = schema
        self.uiSchema = uiSchema
        self.view = view

    def validate(self):
        pass

    @classmethod
    def from_dict(cls, adict):
        return cls(
            meta=adict["meta"], schema=adict["schema"], uiSchema=adict.get("uiSchema", ""), view=adict.get("view", "")
        )

    def to_dict(self):
        return {"meta": self.meta, "schema": self.schema, "uiSchema": self.uiSchema, "view": self.view}

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

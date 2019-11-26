class Template:
    def __init__(self, schema=None, ui_schema=None):
        self.schema = schema
        if ui_schema is None:
            ui_schema = {}
        self.ui_schema = ui_schema

    @classmethod
    def from_dict(cls, adict):
        return cls(schema=adict["schema"], ui_schema=adict.get("uiSchema", ""))

    def to_dict(self, *, include_defaults: bool = True):
        return {"schema": self.schema, "uiSchema": self.ui_schema}

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

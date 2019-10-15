class Template:
    def __init__(self, meta=None, schema=None, uiSchema=None, ui_recipes=None, view=None):
        self.meta = meta
        self.schema = schema
        self.uiSchema = uiSchema
        if ui_recipes is None:
            ui_recipes = []
        self.ui_recipes = ui_recipes
        self.view = view

    def validate(self):
        pass

    @classmethod
    def from_dict(cls, adict):
        return cls(
            meta=adict["meta"],
            schema=adict["schema"],
            ui_recipes=adict.get("uiRecipes", ""),
            uiSchema=adict.get("uiSchema", ""),
            view=adict.get("view", ""),
        )

    def to_dict(self):
        return {
            "meta": self.meta,
            "schema": self.schema,
            "uiRecipes": self.ui_recipes,
            "uiSchema": self.uiSchema,
            "view": self.view,
        }

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

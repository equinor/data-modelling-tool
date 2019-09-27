class AttributeReference:
    def __init__(self, name: str, type: str, dimensions: str, value: str = None):
        self.name = name
        self.type = type
        self.dimensions = dimensions
        self.value = value

    def to_dict(self):
        result = {"name": self.name, "type": self.type, "dimensions": self.dimensions, "value": self.value}
        return result


class Blueprint:
    def __init__(self, uid: str, name: str, description: str, template_ref: str):
        self.uid = uid
        self.name = name
        self.description = description
        self.template_ref = template_ref
        self.form_data = {}
        self.ui_recipe = {}
        self.ui_schema = {}
        # storage_recipes
        # ui_recipes

    def get_template_data_source_id(self):
        return self.template_ref.split("/", 1)[0]

    def get_template_id(self):
        return self.template_ref.split("/", 1)[1]

    def get_template_name(self):
        return self.template_ref.split("/")[-1]

    def get_blueprint_attributes(self):
        primitives = ["string", "number", "integer", "number", "boolean"]
        if "attributes" not in self.form_data:
            return []
        blueprints = list(
            filter(lambda item: "type" in item and item["type"] not in primitives, self.form_data["attributes"])
        )
        return blueprints

    @classmethod
    def from_dict(cls, adict):
        instance = cls(
            uid=adict["uid"], name=adict["name"], description=adict["description"], template_ref=adict["templateRef"]
        )
        instance.form_data = adict["formData"]
        return instance

    def to_dict(self):
        result = {
            "uid": self.uid,
            "name": self.name,
            "description": self.description,
            "templateRef": self.template_ref,
            "formData": self.form_data,
        }
        return result

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

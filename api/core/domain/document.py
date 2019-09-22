from pathlib import Path


class DocumentMeta:
    def __init__(self, template_ref: str):
        self.document_type = "file"
        self.template_ref = template_ref

    def get_template_data_source_id(self):
        return self.template_ref.split("/", 1)[0]

    def get_template_id(self):
        return self.template_ref.split("/", 1)[1]

    def get_template_name(self):
        return self.template_ref.split("/")[-1]

    @classmethod
    def from_dict(cls, adict):
        return cls(template_ref=adict.get("templateRef"))

    def to_dict(self):
        return {"documentType": self.document_type, "templateRef": self.template_ref}


class Document:
    def __init__(self, id: str, template_ref: str):
        self.id = id
        self.meta = DocumentMeta(template_ref=template_ref)
        self.form_data = {}

    def validate(self):
        pass

    @property
    def filename(self) -> str:
        return Path(self.id).name

    @classmethod
    def from_dict(cls, adict):
        instance = cls(id=adict.get("id"), template_ref=adict["meta"]["templateRef"])
        instance.form_data = adict["formData"]
        return instance

    def to_dict(self):
        result = {"meta": self.meta.to_dict(), "formData": self.form_data}
        if self.id:
            result["id"] = self.id
        return result

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

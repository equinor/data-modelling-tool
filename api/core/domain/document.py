class DocumentMeta:
    def __init__(self, name: str = None, document_type: str = None, template_ref: str = None):
        self.name = name
        self.document_type = document_type
        self.template_ref = template_ref

    def get_template_data_source_id(self):
        return self.template_ref.split("/", 1)[0]

    def get_template_name(self):
        return self.template_ref.split("/")[-1]

    @classmethod
    def from_dict(cls, adict):
        return cls(
            name=adict["name"],
            document_type=adict.get("documentType", None),
            template_ref=adict.get("templateRef", None),
        )

    def to_dict(self):
        return {"name": self.name, "documentType": self.document_type, "templateRef": self.template_ref}


class Document:
    def __init__(self, id=None, meta: DocumentMeta = None, formData=None):
        self.id = id
        self.meta = meta
        self.formData = formData

    def validate(self):
        pass

    @classmethod
    def from_dict(cls, adict):
        return cls(id=adict.get("id", None), meta=DocumentMeta.from_dict(adict["meta"]), formData=adict["formData"])

    def to_dict(self):
        result = {"meta": self.meta.to_dict(), "formData": self.formData}
        if self.id:
            result["id"] = self.id
        return result

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

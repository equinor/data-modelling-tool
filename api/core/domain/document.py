class Document:
    def __init__(self, uid: str, path: str, filename: str, type: str, template_ref: str):
        self.uid = uid
        self.path = path
        self.filename = filename
        self.type = type
        self.template_ref = template_ref
        self.form_data = {}
        self.ui_schema = {}

    def get_template_data_source_id(self) -> str:
        return self.template_ref.split("/", 1)[0]

    def get_template_id(self) -> str:
        return self.template_ref.split("/", 1)[1]

    def get_template_name(self) -> str:
        return self.template_ref.split("/")[-1]

    def get_template_path(self) -> str:
        path = self.template_ref.split("/", 1)[1]
        path = path.replace(f"/{self.get_template_name()}", "")
        return f"/{path}"

    def get_template_filename(self) -> str:
        return self.template_ref.split("/")[-1]

    @classmethod
    def from_dict(cls, adict):
        instance = cls(
            uid=adict["uid"],
            path=adict["path"],
            filename=adict["filename"],
            type=adict["type"],
            template_ref=adict["templateRef"],
        )
        instance.form_data = adict["formData"]
        if "uiSchema" in adict:
            instance.ui_schema = adict["uiSchema"]
        else:
            instance.ui_schema = {}

        return instance

    def to_dict(self):
        result = {
            "uid": self.uid,
            "path": self.path,
            "filename": self.filename,
            "type": self.type,
            "templateRef": self.template_ref,
            "formData": self.form_data,
            "uiSchema": self.ui_schema,
        }
        return result

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

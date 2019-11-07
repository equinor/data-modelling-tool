class Document:
    def __init__(self, uid: str, path: str, filename: str, type: str):
        self.uid = uid
        self.path = path
        self.filename = filename
        self.type = type
        self.form_data = {}
        self.ui_schema = {}

    @classmethod
    def from_dict(cls, adict):
        instance = cls(uid=adict["uid"], path=adict["path"], filename=adict["filename"], type=adict["type"])
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
            "formData": self.form_data,
            "uiSchema": self.ui_schema,
        }
        return result

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

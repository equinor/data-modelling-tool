from typing import List


class RootPackageMeta:
    def __init__(self, name: str = None, document_type: str = None, template_ref: str = None):
        self.name = name
        self.document_type = document_type
        self.template_ref = template_ref

    @classmethod
    def from_dict(cls, adict):
        return cls(name=adict["name"], document_type=adict["documentType"], template_ref=adict["templateRef"])

    def to_dict(self):
        return {"name": self.name, "documentType": self.document_type, "templateRef": self.template_ref}


class RootPackageData:
    def __init__(
        self, title: str = None, description: str = None, latest_version: str = None, versions: List[str] = None
    ):
        self.title = title
        self.description = description
        self.latest_version = latest_version
        self.versions = versions

    def validate(self):
        pass

    @classmethod
    def from_dict(cls, adict):
        return cls(
            title=adict["title"],
            description=adict["description"],
            latest_version=adict.get("latestVersion", ""),
            versions=adict.get("versions", []),
        )

    def to_dict(self):
        return {
            "title": self.title,
            "description": self.description,
            "latestVersion": self.latest_version,
            "versions": self.versions,
        }

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()


class RootPackage:
    def __init__(self, id: str = None, meta: RootPackageMeta = None, form_data: RootPackageData = None):
        self.id = id
        self.meta = meta
        self.form_data = form_data

    @classmethod
    def from_dict(cls, adict):
        return cls(
            id=adict.get("id", None),
            meta=RootPackageMeta.from_dict(adict["meta"]),
            form_data=RootPackageData.from_dict(adict["formData"]),
        )

    def to_dict(self):
        result = {"meta": self.meta.to_dict(), "formData": self.form_data.to_dict()}
        if self.id:
            result["id"] = self.id
        return result

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

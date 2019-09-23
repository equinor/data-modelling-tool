from typing import List
from pathlib import Path


class RootPackageMeta:
    def __init__(self, template_ref: str = None):
        self.document_type = "root-package"
        self.template_ref = template_ref

    @classmethod
    def from_dict(cls, adict):
        return cls(template_ref=adict["templateRef"])

    def to_dict(self):
        return {"documentType": self.document_type, "templateRef": self.template_ref}


class RootPackageData:
    def __init__(
        self, title: str = None, description: str = None, latest_version: str = None, versions: List[str] = None
    ):
        self.title = title
        self.description = description
        self.latest_version = [] if latest_version is None else latest_version
        self.versions = [] if versions is None else versions

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
    def __init__(self, id: str, template_ref: str, form_data: RootPackageData = RootPackageData()):
        self.id = id
        self.meta = RootPackageMeta(template_ref=template_ref)
        self.form_data = form_data

    @property
    def filename(self) -> str:
        return Path(self.id).parent.name

    @classmethod
    def from_dict(cls, adict):
        instance = cls(id=adict.get("id"), template_ref=adict["meta"]["templateRef"])
        instance.form_data = RootPackageData.from_dict(adict["formData"])
        return instance

    def to_dict(self):
        result = {"meta": self.meta.to_dict(), "formData": self.form_data.to_dict()}
        if self.id:
            result["id"] = self.id
        return result

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

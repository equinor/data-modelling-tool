from typing import List, NewType
from os.path import dirname
from pathlib import Path

DocumentId = NewType("DocumentId", str)


class SubPackageMeta:
    def __init__(self, document_type: str, template_ref: str):
        self.document_type = document_type
        self.template_ref = template_ref

    @classmethod
    def from_dict(cls, adict):
        return cls(template_ref=adict.get("templateRef"), document_type=adict.get("documentType"))

    def to_dict(self):
        return {"documentType": self.document_type, "templateRef": self.template_ref}


class SubPackageData:
    def __init__(self, title: str = None, description: str = None, subpackages: List[str] = [], files: List[str] = []):
        self.title = title
        self.description = description
        self.subpackages = subpackages
        self.files = files

    def validate(self):
        pass

    @classmethod
    def from_dict(cls, adict):
        return cls(
            title=adict.get("title", None),
            description=adict.get("description", None),
            subpackages=adict.get("subpackages", []),
            files=adict.get("files", []),
        )

    def to_dict(self):
        return {
            "title": self.title,
            "description": self.description,
            "subpackages": self.subpackages,
            "files": self.files,
        }


class SubPackage:
    def __init__(self, id: str, template_ref: str, document_type: str, form_data: SubPackageData = SubPackageData()):
        self.id = id
        self.meta = SubPackageMeta(template_ref=template_ref, document_type=document_type)
        self.form_data = form_data

    @property
    def filename(self) -> str:
        path = Path(self.id)
        parent = path.parent
        if self.meta.document_type == "version":
            parent = parent.parent
            return parent.name
        else:
            return parent.name

    @property
    def path(self) -> str:
        return dirname(self.id)

    def add_file(self, filename) -> DocumentId:
        document_id: DocumentId = f"{self.path}/{filename}"
        self.form_data.files.append(document_id)
        return document_id

    def remove_file(self, filename) -> DocumentId:
        # document_id: DocumentId = f"{self.path}/{filename}"
        document_id = filename
        # is_found = lambda x: x is document_id
        # cleaned_list = filter(is_found, self.form_data.files)
        # self.form_data.files = cleaned_list
        self.form_data.files.remove(document_id)
        return document_id

    def add_subpackage(self, filename):
        document_id = f"{self.path}/{filename}/package"
        self.form_data.subpackages.append(document_id)
        return document_id

    @classmethod
    def from_dict(cls, adict):
        instance = cls(
            id=adict.get("id"), template_ref=adict["meta"]["templateRef"], document_type=adict["meta"]["documentType"]
        )
        instance.form_data = SubPackageData.from_dict(adict["formData"])
        return instance

    def to_dict(self):
        result = {"meta": self.meta.to_dict(), "formData": self.form_data.to_dict()}
        if self.id:
            result["id"] = self.id
        return result

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

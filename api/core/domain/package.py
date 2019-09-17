from typing import List
from os.path import dirname


class PackageMeta:
    def __init__(self, name: str = None, document_type: str = None, template_ref: str = None):
        self.name = name
        self.document_type = document_type
        self.template_ref = template_ref

    @classmethod
    def from_dict(cls, adict):
        return cls(
            name=adict["name"],
            document_type=adict.get("documentType", None),
            template_ref=adict.get("templateRef", None),
        )

    def to_dict(self):
        return {"name": self.name, "documentType": self.document_type, "templateRef": self.template_ref}


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
    def __init__(self, id: str = None, meta: PackageMeta = None, form_data: SubPackageData = None):
        self.id = id
        self.meta = meta
        self.form_data = form_data

    def _get_package_path(self):
        return dirname(self.id)

    def add_file(self, filename):
        document_id = f"{self._get_package_path()}/{filename}"
        self.form_data.files.append(document_id)
        return document_id

    def add_subpackage(self, filename):
        document_id = f"{self._get_package_path()}/{filename}/package"
        self.form_data.subpackages.append(document_id)
        return document_id

    @classmethod
    def from_dict(cls, adict):
        return cls(
            id=adict.get("id", None),
            meta=PackageMeta.from_dict(adict["meta"]),
            form_data=SubPackageData.from_dict(adict["formData"]),
        )

    def to_dict(self):
        result = {"meta": self.meta.to_dict(), "formData": self.form_data.to_dict()}
        if self.id:
            result["id"] = self.id
        return result

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

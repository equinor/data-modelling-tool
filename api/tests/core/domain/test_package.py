from core.domain.root_package import RootPackage, RootPackageMeta, RootPackageData


def test_package_model_init():
    meta = RootPackageMeta(
        **{"name": "Root Package 1", "document_type": "Document type", "template_ref": "templates/package"}
    )
    form_data = RootPackageData(
        **{"title": "Title", "description": "Description", "latest_version": "Latest Version", "versions": []}
    )
    package = RootPackage(meta=meta, form_data=form_data)
    assert isinstance(package, RootPackage)
    assert package.form_data.title == form_data.title
    assert package.form_data.description == form_data.description
    assert package.form_data.latest_version == form_data.latest_version
    assert package.form_data.versions == form_data.versions


def test_package_model_from_dict():
    data = {
        "formData": {
            "title": "Title",
            "description": "Description",
            "latestVersion": "Latest Version",
            "versions": [],
        },
        "meta": {"name": "Root Package 1", "documentType": "Document type", "templateRef": "templates/package"},
    }
    package = RootPackage.from_dict(data)
    assert package.form_data.title == data["formData"]["title"]
    assert package.form_data.description == data["formData"]["description"]
    assert package.form_data.latest_version == data["formData"]["latestVersion"]
    assert package.form_data.versions == data["formData"]["versions"]


def test_package_model_to_dict():
    data = {
        "formData": {
            "title": "Title",
            "description": "Description",
            "latestVersion": "Latest Version",
            "versions": [],
        },
        "meta": {"name": "Root Package 1", "documentType": "Document type", "templateRef": "templates/package"},
    }
    package = RootPackage.from_dict(data)
    assert package.to_dict() == data


def test_package_model_comparison():
    data = {
        "formData": {
            "title": "Title",
            "description": "Description",
            "latestVersion": "Latest Version",
            "versions": [],
        },
        "meta": {"name": "Root Package 1", "documentType": "Document type", "templateRef": "templates/package"},
    }
    package1 = RootPackage.from_dict(data)
    package2 = RootPackage.from_dict(data)
    assert package1 == package2

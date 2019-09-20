from unittest import mock
from core.domain.package import SubPackage, SubPackageData, PackageMeta
from core.use_case.add_file_to_package_use_case import AddFileToPackageRequestObject, AddFileToPackageUseCase


def test_without_parameters():

    document_repository = mock.Mock()

    def mock_save(document, document_id):
        return document

    package_repository = mock.Mock()
    meta = PackageMeta(**{"name": "parent", "document_type": "subpackage", "template_ref": "templates/package"})
    form_data = SubPackageData(**{"title": "Title", "description": "Description"})
    sub_package = SubPackage(id="parent", meta=meta, form_data=form_data)
    package_repository.get_by_id.return_value = sub_package

    def mock_update(parent_id, package):
        return package

    package_repository.update.return_value = mock_update

    document_repository.save = mock_save
    use_case = AddFileToPackageUseCase(document_repository=document_repository, package_repository=package_repository)
    request_object = AddFileToPackageRequestObject.from_dict(
        {
            "parentId": "parent",
            "document": {"meta": {"name": "Name", "templateRef": "", "documentType": ""}, "formData": {}},
        }
    )

    response_object = use_case.execute(request_object)

    assert bool(response_object) is True
    package_repository.get_by_id.assert_called_with("parent")

    assert response_object.value == {"formData": {}, "meta": {"name": "Name", "templateRef": "", "documentType": ""}}

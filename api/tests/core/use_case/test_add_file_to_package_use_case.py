from unittest import mock
from core.domain.sub_package import SubPackage, SubPackageData, SubPackageMeta
from core.use_case.add_file_to_package_use_case import AddFileToPackageRequestObject, AddFileToPackageUseCase
from core.repository.interface.sub_package_repository import SubPackageRepository
from core.repository.interface.document_repository import DocumentRepository


def test_without_parameters():

    document_repository: DocumentRepository = mock.Mock()

    def mock_save(document):
        return document

    sub_package_repository: SubPackageRepository = mock.Mock()
    meta = SubPackageMeta(**{"name": "parent", "document_type": "subpackage", "template_ref": "templates/package"})
    form_data = SubPackageData(**{"title": "Title", "description": "Description"})
    sub_package = SubPackage(id="parent", meta=meta, form_data=form_data)
    sub_package_repository.get.return_value = sub_package

    def mock_update(parent_id, package):
        return package

    sub_package_repository.update.return_value = mock_update

    document_repository.save = mock_save
    use_case = AddFileToPackageUseCase(
        document_repository=document_repository, sub_package_repository=sub_package_repository
    )
    request_object = AddFileToPackageRequestObject.from_dict(
        {"parentId": "parent", "filename": "Name", "templateRef": ""}
    )
    response_object = use_case.execute(request_object)

    assert bool(response_object) is True
    sub_package_repository.get.assert_called_with("parent")

    result = response_object.value.to_dict()

    assert result == {"id": "/Name", "formData": {}, "meta": {"documentType": "file", "templateRef": ""}}

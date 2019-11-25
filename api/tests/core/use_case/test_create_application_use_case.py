# flake8: noqa: F401

from unittest import mock
from core.domain.dto import DTO
from core.repository.interface.document_repository import DocumentRepository
from core.use_case.create_application_use_case import (
    CreateApplicationUseCase,
    CreateApplicationRequestObject,
    generate_runnable_file,
)

APPLICATION_SETTING = {
    "packages": [],
    "actions": [
        {
            "name": "Runnable Name",
            "description": "Runnable Description",
            "input": "InputModel",
            "output": "OutputModel",
            "method": "runnableMethod",
        }
    ],
}


def simple_compare(a, b):
    return [c for c in a if c.isalpha()] == [c for c in b if c.isalpha()]


def test_generate_runnable_file():
    target = """\
    const runnableMethod = async ({input, output, updateDocument}) => {
        return {}
    }
    const runnableMethods = {
        runnableMethod
    }
    export default runnableMethods        
    """
    result = generate_runnable_file(APPLICATION_SETTING["actions"])
    assert simple_compare(result, target) is True


def test_create():
    document_repository: DocumentRepository = mock.Mock()
    document_repository.get.return_value = DTO(data=APPLICATION_SETTING)
    use_case = CreateApplicationUseCase(document_repository=document_repository)
    data = {"applicationId": "NOT USED IN THIS TEST"}
    request_object = CreateApplicationRequestObject.from_dict(data)
    response_object = use_case.execute(request_object)
    assert bool(response_object) is True
    document_repository.get.assert_called_with(data["applicationId"])

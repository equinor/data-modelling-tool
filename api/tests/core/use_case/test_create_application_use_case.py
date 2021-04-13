# flake8: noqa: F401
import unittest
from unittest import mock
from classes.dto import DTO
from core.service.application_service import ApplicationService
from core.service.document_service import DocumentService

APPLICATION_SETTING = {
    "name": "TestApp",
    "type": "system/SIMOS/Application",
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


# def simple_compare(a, b):
#     return [c for c in a if c.isalpha()] == [c for c in b if c.isalpha()]
#
#
# def test_generate_runnable_file():
#     target = """\
# // This file is tightly coupled with the settings.json file, which contain your application settings.
# // The settings file has 'actions', they look like this;
# //     {
# //       "name": "Calculate",
# //       "description": "Simulate 80kmh concrete crash. Fiat panda 2011.",
# //       "input": "SSR-DataSource/CarPackage/Car",
# //       "output": "SSR-DataSource/CarPackage/Result",
# //       "method": "run"
# //     },
# //
# // This action will be available on any entity of the type "SSR-DataSource/CarPackage/Car"(input).
# // The name given in "method" must be the name of a function in this file, as well as being in the "runnableMethods" object at the end of this file.
# // The main use case for this custom function is to call SIMOS calculations, and update result objects.
# // The properties that are passed to the function looks like this;
# //       type Input = {
# //         blueprint: string
# //         entity: any
# //         path: string
# //         id: string
# //       }
# //
# //       type Output = {
# //         blueprint: string
# //         entity: any
# //         path: string
# //         dataSource: string
# //         id: string
# //       }
# //
# //       updateDocument(output: Output): Function
# //
# // Current limitations and caveats;
# // * updateDocument is a callBack. That means that if the web-browser get's interrupted(refresh,closed, etc.) the callBack is lost.
# // * The API uses a strict type system, so if the output entity does NOT match the output blueprint, that attribute will not be updated.
# // * The API uses an "update" strategy when writing the output entity. This means that it merges the existing document with the provided output entity.
# // * The output object must be left intact, and posted on every updateDocument call. Everything besides the output.entity object should be considered "read-only".
# // Here are a few examples;
# //
# // function sleep(ms) {
# //   return new Promise(resolve => setTimeout(resolve, ms))
# // }
# //
# // function myExternalSystemCall(input) {
# //   return {
# //     jobId: 'kk873ks',
# //     result: 123456,
# //     executionTime: '1233215.34234ms',
# //     progress: 100,
# //     status: 'done',
# //     message: 'job complete, no errors',
# //   }
# // }
# //
# // async function run({ input, output, updateDocument }) {
# //   let entity = {
# //     ...output.entity,
# //     // This is an invalid attribute. Will not get written to database.
# //     hallo: 'Hey',
# //   }
# //   updateDocument({ ...output, entity })
# //
# //   // If the browser is interrupted during this sleep, the rest of the function will NOT be executed.
# //   await sleep(10000)
# //   entity = { diameter: 346 }
# //   updateDocument({ ...output, entity })
# //   updateDocument({ ...output, entity: myExternalSystemCall(input) })
# // }
#
#     const runnableMethod = async ({input, output, updateDocument}) => {
#         return {}
#     }
#     const runnableMethods = {
#         runnableMethod
#     }
#     export default runnableMethods
#     """
#     result = generate_runnable_file(APPLICATION_SETTING["actions"])
#     assert simple_compare(result, target) is True


class CreateApplication(unittest.TestCase):
    def test_create(self):
        document_repository = mock.Mock()
        document_repository.get.return_value = DTO(data=APPLICATION_SETTING)
        document_service = DocumentService(blueprint_provider=document_repository)
        application_service = ApplicationService(document_service)
        actual = application_service.create_application("test", "NOT USED IN THIS TEST")
        print(actual)
import unittest
from unittest import skip

from services.application_service import ApplicationService
from services.document_service import DocumentService

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


class CreateApplication(unittest.TestCase):
    @skip
    def test_create(self):
        document_service = DocumentService(uid_document_provider=lambda x, y: APPLICATION_SETTING)
        application_service = ApplicationService(document_service)
        application_service.create_application("test", "NOT USED IN THIS TEST")

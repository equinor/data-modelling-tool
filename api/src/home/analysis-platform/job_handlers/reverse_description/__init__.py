import json
from datetime import datetime

import requests

from config import config
from services.job_handler_interface import JobHandlerInterface
from utils.logging import logger

_SUPPORTED_TYPE = "WorkflowDS/Blueprints/jobHandlers/ReverseDescription"


class JobHandler(JobHandlerInterface):
    """
    A silly test jobHandler that creates a NamedEntity of the input with it's description reversed
    """

    def __init__(self, data_source: str, job_entity: dict, token: str, insert_reference: callable):
        super().__init__(data_source, job_entity, token, insert_reference)
        self.headers = {"Access-Key": token}

    def _get_by_id(self, document_id: str, depth: int = 1, attribute: str = ""):
        params = {"depth": depth, "attribute": attribute}
        req = requests.get(f"{config.DMSS_API}/api/v1/documents/{document_id}", params=params, headers=self.headers)
        req.raise_for_status()

        return req.json()

    def _add_to_path(self, data_source: str, body: dict):
        form_data = {k: json.dumps(v) if isinstance(v, dict) else str(v) for k, v in body.items()}
        req = requests.post(
            f"{config.DMSS_API}/api/v1/explorer/{data_source}/add-to-path?update_uncontained=False",
            data=form_data,
            headers=self.headers,
        )
        req.raise_for_status()

        return req.json()

    def start(self) -> str:
        logger.info("Starting ReverseDescription job.")
        output_data_source, output_directory = self.job_entity["outputTarget"].split("/", 1)
        input = self.job_entity["input"]
        if self.job_entity["input"].get("_id", None):  # If input has _id, fetch the document
            input = self._get_by_id(f"{output_data_source}/{self.job_entity['input']['_id']}")
        result = input
        result["description"] = input.get("description", "")[::-1]
        result["name"] = (
            f"reverse-description-job-result-{datetime.now()}".replace(".", "_").replace(":", "_").replace(" ", "_")
        )
        result.pop("_id", None)

        add_response = self._add_to_path(output_data_source, {"directory": output_directory, "document": result})

        self.insert_reference({"name": result["name"], "type": result["type"], "_id": add_response["uid"]})

        logger.info("ReverseDescription job completed")
        return "OK"

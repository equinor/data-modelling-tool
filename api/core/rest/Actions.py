import json
from enum import Enum
from flask import Blueprint, Response, request

from classes.dto import DTO

from classes.data_source import DataSource
from core.repository.repository_factory import get_repository


class ApiActions(Enum):
    UPLOAD = "UPLOAD"


blueprint = Blueprint("actions", __name__)


@blueprint.route("/api/v3/actions", methods=["POST"])
def process_action():
    request_data = request.get_json()
    process_action = ProcessAction(request_data)
    return process_action.process_action()


class ProcessAction:
    def __init__(self, request_data):
        data_source_id = request_data["dataSource"]
        data_source = DataSource(uid=data_source_id)
        self.data_source = DataSource(uid=data_source_id)
        self.document_repository = get_repository(data_source)

        # shared common request data properties
        self.action = request_data["action"]
        self.data = request_data["data"]
        self.parent_id = request_data["parentId"]

    def process_action(self):
        if self.action == ApiActions.UPLOAD.value:
            return self._process_upload()
        else:
            return Response(
                json.dumps({"status": f"action {self.action} is not supported"}),
                mimetype="application/json",
                status=500,
            )

    def _process_upload(self):
        # todo implement use-case for upload.
        package_dto = self.document_repository.get(self.parent_id)

        for document_data in self.data:
            dto = DTO(data=document_data["entity"])
            # assume everything is contained in storage until database service layer handle this.
            self.document_repository.add(dto)
            reference = {"_id": dto.uid, "name": dto.data.get("name", ""), "type": dto.data.get("type", "")}
            package_dto.get_values("content").append(reference)

        self.document_repository.update(package_dto)
        return Response(json.dumps({"status": "ok"}), mimetype="application/json", status=200)

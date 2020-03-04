import json
from enum import Enum
from flask import Blueprint, Response, request

from classes.dto import DTO

from classes.data_source import DataSource
from core.repository.repository_factory import get_repository
from core.service.document_service import DocumentService


class ApiActions(Enum):
    UPLOAD = ("UPLOAD",)
    UPDATE_RAW_DOCUMENT = "UPDATE_RAW_DOCUMENT"


blueprint = Blueprint("actions", __name__)


@blueprint.route("/api/v3/actions", methods=["POST"])
def process_action():
    request_data = request.get_json()
    process_action = ProcessAction(request_data)
    return process_action.process_action()


class ProcessAction:
    def __init__(self, request_data):
        # shared common request data properties
        self.data_source_id = request_data["datasource"]
        self.action = request_data["action"]
        self.data = request_data["data"]
        self.request_data = request_data

        repository_provider = get_repository
        self.document_service = DocumentService(repository_provider=repository_provider)

    def process_action(self):
        if self.action == ApiActions.UPLOAD.value:
            return self._process_upload()
        elif self.action == ApiActions.UPDATE_RAW_DOCUMENT.value:
            return self._process_update_raw_document()
        else:
            return Response(
                json.dumps({"status": f"action {self.action} is not supported"}),
                mimetype="application/json",
                status=500,
            )

    def _process_upload(self):
        # todo implement use-case for upload.
        parent_id = request_data["parentId"]
        # todo use document_service with invalidate cache.
        #         package_dto = self.document_repository.get(parent_id)
        #         for document_data in self.data:
        #             dto = DTO(data=document_data["entity"])
        #             # assume everything is contained in storage until database service layer handle this.
        #             self.document_repository.add(dto)
        #             reference = {"_id": dto.uid, "name": dto.data.get("name", ""), "type": dto.data.get("type", "")}
        #             package_dto.get_values("content").append(reference)
        #
        #         self.update_raw_document.update(package_dto)
        return Response(json.dumps({"status": "ok"}), mimetype="application/json", status=200)

    def _process_update_raw_document(self):
        if "_id" not in self.data:
            print("invalid usage of the action. Document must have an id, did you intend to create a new document?")
        else:
            uid = self.data["_id"]
            self.document_service.update_raw_document(
                data_source_id=self.data_source_id, dto=DTO(uid=uid, data=self.data)
            )
        return Response(json.dumps({"status": "ok"}), mimetype="application/json", status=200)

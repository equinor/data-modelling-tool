import json
from enum import Enum

from flask import Blueprint, request, Response

from core.service.document_service import DocumentService


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
        self.data_source = request_data["dataSource"]
        self.document_service = DocumentService()

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
        # TODO: Reimplement in DMSS
        raise NotImplementedError
        # package_dto = self.document_service.get_by_uid(self.data_source, self.parent_id)
        #
        # for document_data in self.data:
        #     dto = DTO(data=document_data["entity"])
        #     explorer_api.add_to_parent(
        #         self.data_source,
        #         {
        #             "parentId": request_data.get("parentId"),
        #             "type": request_data.get("type"),
        #             "name": request_data.get("name"),
        #             "description": request_data.get("description"),
        #             "attribute": request_data.get("attribute"),
        #         },
        #         _preload_content=False,
        #     )
        #     # self.document_repository.add(dto)
        #     reference = {"_id": dto.uid, "name": dto.name, "type": dto.type}
        #     package_dto.get_values("content").append(reference)
        #
        # self.document_repository.update(package_dto)
        # return Response(json.dumps({"status": "ok"}), mimetype="application/json", status=200)

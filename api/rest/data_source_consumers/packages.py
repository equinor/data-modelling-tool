import json

from flask import request
from flask_restful import Resource

from classes.data_source import DataSource
from classes.package_request import PackageRequest, DocumentType

nodes_with_parent = (DocumentType.SUB_PACKAGE, DocumentType.FILE)


# TODO: This is probaly not good...
def update_parent(data_source: DataSource, parent_id: str, child_id: str, node_type: DocumentType, delete=False):
    if delete:
        data_source.client.pull_from_parent(id=parent_id, child_id=child_id, node_type=node_type)
    else:
        data_source.client.append_to_parent(id=parent_id, child_id=child_id, node_type=node_type)


def create_version_package(package_request: PackageRequest, data_source: DataSource, latest_version):
    document = f"""
{{
  "_id": "{latest_version}/package",
  "meta": {{
    "name": "package",
    "documentType": "{DocumentType.VERSION.value}",
    "templateRef": "templates/package-template"
  }},
  "formData": {{
    "title": "{package_request.meta['name']}",
    "description": "{package_request.formData['description']}",
    "subpackages": [],
    "files": []
  }}
}}
    """
    data_source.client.create_form(json.loads(document))


class Packages(Resource):
    @staticmethod
    def post(data_source_id: str):
        data_source = DataSource(id=data_source_id)
        package_request = PackageRequest(request.get_json())

        if DocumentType.has_parent(DocumentType(package_request.node_type)):
            update_parent(data_source, package_request.parent_id, package_request.id, package_request.node_type)

        # TODO: Fix this hack when we want to support versions
        # Now, this creates a dummy version 1.0.0 for all root-packages
        if package_request.node_type is DocumentType.ROOT_PACKAGE:
            latest_version = f"{package_request.id.split('/', 1)[0]}/1.0.0"
            latest_version_id = f"{latest_version}/package"
            package_request.formData["latestVersion"] = latest_version_id
            create_version_package(package_request, data_source, latest_version)

        data_source.client.create_form(
            {"meta": package_request.meta, "formData": package_request.formData}, _id=package_request.id
        )
        return {
            "nodeType": package_request.node_type.value,
            "title": package_request.formData["title"],
            "id": package_request.id,
        }

    @staticmethod
    def delete(data_source_id: str):
        data_source = DataSource(id=data_source_id)
        package_request = PackageRequest(request.get_json())

        # TODO: Delete children of package
        if package_request.node_type in nodes_with_parent:
            update_parent(
                data_source, package_request.parent_id, package_request.id, package_request.node_type, delete=True
            )

        data_source.client.delete(_id=package_request.id)
        return True

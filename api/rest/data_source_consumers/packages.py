from flask import request
from flask_restful import Resource

from classes.data_source import DataSource
from classes.package_request import PackageRequest

nodes_with_parent = ("folder", "file")


# TODO: This is probaly not good...
def update_parent(data_source: DataSource, parent_id: str, child_id: str, node_type: str, delete=False):
    if node_type == "file":
        if delete:
            data_source.client.pull_from_parent(_id=parent_id, form={"files": child_id})
        else:
            data_source.client.append_to_parent(_id=parent_id, form={"files": child_id})
    if node_type == "folder":
        if delete:
            data_source.client.pull_from_parent(_id=parent_id, form={"subpackages": child_id})
        else:
            data_source.client.append_to_parent(_id=parent_id, form={"subpackages": child_id})


def get_documentType(is_root: bool, node_type: str):
    if is_root:
        return "root-package"
    return "subpackage"


class Packages(Resource):
    @staticmethod
    def post(data_source_id: str):
        data_source = DataSource(_id=data_source_id)
        package_request = PackageRequest(request.get_json())

        if package_request.node_type in nodes_with_parent:
            update_parent(data_source, package_request.parent_id, package_request.id, package_request.node_type)

        if package_request.node_type == "folder":
            package_request.form_data["documentType"] = get_documentType(package_request.is_root,
                                                                         package_request.node_type)
            
        data_source.client.create_form(package_request.form_data, _id=package_request.id)
        return {
            "isRoot": package_request.is_root,
            "nodeType": package_request.node_type,
            "title": package_request.form_data["title"],
            "id": package_request.id,
        }

    @staticmethod
    def delete(data_source_id: str):
        data_source = DataSource(_id=data_source_id)
        package_request = PackageRequest(request.get_json())

        if package_request.node_type in nodes_with_parent:
            update_parent(
                data_source, package_request.parent_id, package_request.id, package_request.node_type, delete=True
            )

        data_source.client.delete(package_request.form_data, _id=package_request.id)
        return True

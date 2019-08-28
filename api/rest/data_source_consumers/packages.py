from os.path import dirname

from flask import request
from flask_restful import Resource

from classes.data_source import DataSource


def update_parent(data_source: DataSource, parent_id: str, child_id: str, form_type: str, delete=False):
    if form_type == "file":
        if delete:
            data_source.client.pull_from_parent(_id=parent_id, form={"files": child_id})
        else:
            data_source.client.append_to_parent(_id=parent_id, form={"files": child_id})
    if form_type == "folder":
        if delete:
            data_source.client.pull_from_parent(_id=parent_id, form={"subpackages": child_id})
        else:
            data_source.client.append_to_parent(_id=parent_id, form={"subpackages": child_id})


def create_id(form_type: str, title: str, parent_package: str):
    if form_type == "root-package":
        return f"{title}/package.json"
    if form_type == "file":
        return f"{parent_package}/{title}.json"
    if form_type == "folder":
        return f"{parent_package}/{title}/package.json"


class Packages(Resource):
    @staticmethod
    def post(data_source_id: str):
        data_source = DataSource(_id=data_source_id)
        form = request.get_json()
        # TODO: Validate form

        form_data = form["formData"]
        parent_id = form["parentID"]
        form_type = form["nodeType"]
        _id = create_id(form_type, title=form_data["title"], parent_package=dirname(parent_id))

        if form_type in ("folder", "file"):
            update_parent(data_source, parent_id, _id, form_type)

        data_source.client.create_form(form_data, _id=_id)

        return {
            form_data["_id"]: {
                "description": form_data["description"],
                "isRoot": (form_type not in ("file", "subpackage")),
                "nodeType": form_type,
                "title": form_data["title"],
                "_id": form_data["_id"],
            }
        }

    @staticmethod
    def delete(data_source_id: str):
        data_source = DataSource(_id=data_source_id)
        form = request.get_json()
        # TODO: Validate form

        form_data = form["formData"]
        parent_id = form["parentID"]
        form_type = form["nodeType"]
        _id = create_id(form_type, title=form_data["title"], parent_package=dirname(parent_id))

        if form_type in ("folder", "file"):
            update_parent(data_source, parent_id, _id, form_type, delete=True)

        data_source.client.delete(form_data, _id=_id)
        return True

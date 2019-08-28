from flask_restful import Resource

from classes.data_source import DataSource
from utils.logging import logger


def index_package(package_id: str, data_source: DataSource):
    index = {}
    package = data_source.client.read_form(package_id)

    for file in package["files"]:
        tmp_file = data_source.client.read_form(file)

        tmp_file["nodeType"] = "file"
        tmp_file["isRoot"] = False
        tmp_file.pop("attributes", {})
        tmp_file.pop("properties", {})

        index[tmp_file["_id"]] = tmp_file

    for sub_package in package.get("subpackages", []):
        index.update(**index_package(package_id=sub_package, data_source=data_source))

    if not package["documentType"] == "version":
        package["nodeType"] = package.pop("documentType")
        package["isRoot"] = False
        package["children"] = package.pop("subpackages", []) + package.pop("files", [])
        index[package["_id"]] = package

    return index


def index_data_source(data_source: DataSource):
    root_packages = data_source.client.get_root_packages()
    index = {}

    try:
        for root_package in root_packages:
            latest_version = data_source.client.read_form(root_package["latestVersion"])
            root_package["children"] = latest_version.get("subpackages", []) + latest_version.get("files", [])
            root_package["nodeType"] = root_package.pop("documentType")
            root_package["isRoot"] = True

            index[root_package["_id"]] = root_package
    except Exception as error:
        logger.warning(f"The root-package {root_package['_id']} could not be indexed. {error}")

    try:
        index.update(**index_package(package_id=root_package["latestVersion"], data_source=data_source))
    except Exception as error:
        logger.warning(f"The subpackage {root_package['latestVersion']} could not be indexed. {error}")

    return index


class Index(Resource):
    @staticmethod
    def get(data_source_id):
        data_source = DataSource(data_source_id)
        return index_data_source(data_source=data_source)

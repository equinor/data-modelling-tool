from flask_restful import Resource

from classes.data_source import DataSource
from classes.files import File
from classes.root_package import RootPackage
from classes.subpackage import Package
from utils.logging import logger


# TODO: Create DataModels


def index_package(package_id: str, data_source: DataSource):
    index = {}
    package = Package(data_source.client.read_form(package_id), data_source)

    for file in package.files:
        tmp_file = File(data_source.client.read_form(file), data_source)
        index[tmp_file.id] = tmp_file.as_dict()
    for sub_package in package.subpackages:
        index.update(**index_package(package_id=sub_package, data_source=data_source))

    index[package.id] = package.as_dict()

    return index


def index_data_source(data_source: DataSource):
    root_packages = data_source.client.get_root_packages()
    index = {}

    for package in root_packages:
        root_package = RootPackage(package, data_source)
        index[root_package.id] = root_package.as_dict()

        # TODO: Handle index for different versions
        try:
            index.update(**index_package(package_id=root_package.latest_version_id, data_source=data_source))
        except Exception as error:
            logger.warning(f"The subpackage {root_package.latest_version_id} could not be indexed. {error}")

    return index


class Index(Resource):
    @staticmethod
    def get(data_source_id):
        data_source = DataSource(data_source_id)
        return index_data_source(data_source=data_source)

    # TODO: Is this used by test as mock only?
    # @staticmethod
    # def post(data_source_id):
    #     data = request.get_json()
    #     data_source = DataSource.mock([{**item["content"], "_id": item["id"]} for item in data])
    #     return index_data_source(data_source)

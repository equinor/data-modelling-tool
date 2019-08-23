from flask_restful import Resource

from classes.data_source import DataSource


def index_package(package_id: str, data_source: DataSource):
    index = []
    package = data_source.client.read_form(package_id)
    package['nodeType'] = 'subpackage'
    index.append(package)

    for file in package['files']:
        tmp_file = data_source.client.read_form(file)
        tmp_file['nodeType'] = 'file'
        tmp_file.pop('attributes')
        index.append(tmp_file)

    for sub_package in package.get('subpackages', []):
        index.extend(index_package(package_id=sub_package, data_source=data_source))
    return index


def index_data_source(data_source_id: str):
    data_source = DataSource(data_source_id)
    root_packages = data_source.client.get_root_packages()
    index = []

    for root_package in root_packages:
        root_package['nodeType'] = root_package.pop('documentType')
        index.append(root_package)
        index.extend(index_package(package_id=root_package['latestVersion'], data_source=data_source))

    return index


class Index(Resource):
    @staticmethod
    def get(data_source_id):
        return index_data_source(data_source_id=data_source_id)

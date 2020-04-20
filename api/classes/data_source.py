from core.repository.repository_exceptions import RepositoryException
from services.data_modelling_document_service import datasource_api


class DataSource:
    def __init__(self, uid: str):
        data_source_dict = datasource_api.get_data_source(uid)
        if not data_source_dict:
            raise RepositoryException(f"Error: The data-source was not found. ID: {uid}")

        self.id = uid
        self.type = data_source_dict["type"]
        self.host = data_source_dict.get("host")
        self.port = data_source_dict["port"]
        self.username = data_source_dict["username"]
        self.password = data_source_dict["password"]
        self.tls = data_source_dict.get("tls", False)
        self.name = data_source_dict["name"]
        self.database = data_source_dict["database"]
        self.collection = data_source_dict["collection"]
        self.documentType = data_source_dict["documentType"]

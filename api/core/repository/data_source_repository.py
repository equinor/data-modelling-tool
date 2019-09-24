from typing import List

from config import Config
from core.domain.data_source import DataSource
from services.database import data_modelling_tool_db as database
from utils.enums import DataSourceDocumentType, DataSourceType


class DataSourceRepository:
    collection = database[f"{Config.DATA_SOURCES_COLLECTION}"]

    def list(self, document_type: DataSourceDocumentType) -> List[DataSource]:
        all_sources = [DataSource(id="local", host="client", name="Local workspace", type="localStorage")]
        for data_source in self.collection.find(
            filter={"documentType": document_type.value}, projection=["host", "name", "type"]
        ):
            data_source["id"] = data_source.pop("_id")
            all_sources.append(
                DataSource(
                    id=data_source["id"],
                    host=data_source["host"],
                    name=data_source["name"],
                    type=DataSourceType(data_source["type"]).value,
                )
            )
        return all_sources

    # def data_source_post(id):
    #     document = request.get_json()
    #     validate_mongo_data_source(document)
    #     document["_id"] = id
    #     logger.info(f"Inserting new data-source with id {document['_id']}.")
    #     result = collection.insert_one(document)
    #     logger.info(f"Successfully inserted with id {result}")
    #     return str(result.inserted_id)
    #
    # def data_source_put(id):
    #     document = request.get_json()
    #     validate_mongo_data_source(document)
    #     result = collection.replace_one({"_id": id}, document, upsert=True)
    #     return str(result.acknowledged)
    #
    # def data_source_delete(id):
    #     result = collection.delete_one(filter={"_id": id})
    #     return result.acknowledged

import json

from core.domain.data_source import DataSource


class GetDataSourcesSerializer(json.JSONEncoder):
    def default(self, data_source: DataSource):
        try:
            to_serialize = {
                "id": data_source.id,
                "name": data_source.name,
                "host": data_source.host,
                "type": data_source.type,
            }
            return to_serialize
        except AttributeError:
            return super().default(data_source)

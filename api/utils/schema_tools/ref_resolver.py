from urllib.parse import urlparse
from services.database import model_db


# TODO: This is not complete
def schema_ref_resolver(json_schema, definitions):
    if hasattr(json_schema, 'items'):
        for key, value in json_schema.items():
            if key == "$ref":
                path = urlparse(value)[2]
                split_path = path.split('/', maxsplit=3)
                collection = split_path[2]
                id = split_path[3]
                json_schema[key] = f'#/definitions/{id}'
                referred_schema = model_db[f'{collection}'].find_one({"_id": id})
                definitions[id] = referred_schema

            if isinstance(value, dict):
                json_schema[key] = schema_ref_resolver(value, definitions)

            elif isinstance(value, list):
                new_value = []
                for i in value:
                    new_value.append(schema_ref_resolver(i, definitions))
                json_schema[key] = new_value

    return json_schema, definitions

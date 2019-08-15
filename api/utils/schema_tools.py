from urllib.parse import urlparse

from services.database import model_db


def replace_dict_keys(old_key, new_key, input_dict):
    """
    :param old_key: The key to replace from the dict.
    :param new_key: A string to rename the old key.
    :param input_dict: A complex dictionary.
    :return: A dict
    """
    if hasattr(input_dict, 'items'):
        for key, value in input_dict.items():
            if key == old_key:
                input_dict[new_key] = input_dict.pop(old_key)
            if isinstance(value, dict):
                input_dict[key] = replace_dict_keys(old_key, new_key, value)
            elif isinstance(value, list):
                new_value = []
                for i in value:
                    new_value.append(replace_dict_keys(old_key, new_key, i))
                input_dict[key] = new_value
    return input_dict


def json_schema_to_mongo_document(json_schema):
    for key in ('ref', 'schema', 'id'):
        mongo_document = replace_dict_keys(f'${key}', f'__{key}__', json_schema)
    return mongo_document


def mongo_document_to_json_schema(mongo_document):
    for key in ('ref', 'schema', 'id'):
        json_schema = replace_dict_keys(f'__{key}__', f'${key}', mongo_document)
    return json_schema


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

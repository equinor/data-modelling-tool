import json

from jsonschema import validate, ValidationError

from config import Config
from services.database import data_modelling_tool_db as database

def validate_mongo_data_source(document: dict):
    with open("/code/schemas/templates/mongodb.json") as json_file:
        schema = json.load(json_file)["schema"]
    try:
        validate(instance=document, schema=schema)
    except ValidationError as error:
        return error

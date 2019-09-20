from flask_restful import abort
from jsonschema import validate, ValidationError

from config import Config
from services.database import data_modelling_tool_db as database


def validate_mongo_data_source(document):
    schema = database[Config.TEMPLATES_COLLECTION].find_one(filter={"_id": "mongodb-datasource-template"})
    try:
        validate(instance=document, schema=schema["schema"])
    except ValidationError as error:
        return abort(400, message=error)

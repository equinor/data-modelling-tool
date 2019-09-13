from flask_restful import abort
from jsonschema import validate, ValidationError

from config import Config
from services.database import data_modelling_tool_db as database


def validate_package_request(document):
    schema = database[Config.TEMPLATES_COLLECTION].find_one(filter={"_id": "package-request"})["schema"]
    try:
        return validate(instance=document, schema=schema)
    except ValidationError as error:
        return abort(400, message=error.message)

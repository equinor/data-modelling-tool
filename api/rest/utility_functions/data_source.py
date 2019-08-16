from collections import namedtuple

from bson.objectid import ObjectId
from pymongo import MongoClient

from config import Config
from services.database import data_modelling_tool_db as db


def get_data_source(_id, form_type):
    if form_type == 'blueprint':
        collection = Config.BLUEPRINT_DATA_SOURCE_COLLECTION
    else:
        collection = Config.ENTITY_DATA_SOURCE_COLLECTION
    # TODO: Auth
    dict = db[f'{collection}'].find_one({'_id': ObjectId(_id)})
    dict['id'] = str(dict.pop('_id'))
    as_class = namedtuple("DataSource", dict.keys())(*dict.values())
    return as_class


# TODO
def get_connection_string(data_source):
    return None


def get_data_source_client(data_source):
    if data_source.type == 'mongodb':
        mongo_client = MongoClient(
            host=data_source.host,
            port=data_source.port,
            username=data_source.username,
            password=data_source.password,
        )
        return mongo_client[data_source.database]

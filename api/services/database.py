from pymongo import MongoClient

from config import Config

if Config.ENVIRONMENT == 'local':
    client = MongoClient('db',
                         username=Config.MONGO_USERNAME,
                         password=Config.MONGO_PASSWORD,
                         authMechanism='SCRAM-SHA-256')
else:
    client = MongoClient(Config.MONGO_URI)

db = client[Config.MONGO_DB]

from pymongo import MongoClient

from config import Config

client = MongoClient('db',
                     username=Config.MONGO_USERNAME,
                     password=Config.MONGO_PASSWORD,
                     authMechanism='SCRAM-SHA-256')

db = client[Config.MONGO_DB]

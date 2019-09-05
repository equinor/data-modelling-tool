from pymongo import MongoClient
from utils.logging import logger
from config import Config

if Config.ENVIRONMENT == "local":
    client = MongoClient("db", username=Config.MONGO_USERNAME, password=Config.MONGO_PASSWORD)
else:
    logger.info(f"Using Database for {Config.ENVIRONMENT}.")
    client = MongoClient(Config.MONGO_URI, connect=False)

model_db = client[Config.MONGO_DB]
data_modelling_tool_db = client[Config.MONGO_DATA_MODELLING_TOOL_DB]

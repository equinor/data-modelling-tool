import json
import os
from pathlib import Path


class Config:
    MONGO_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME", "maf")
    MONGO_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD", "maf")
    MONGO_URI = os.getenv("MONGO_AZURE_URI", "")
    MONGO_DB = os.getenv("ENVIRONMENT", os.getenv("RADIX_ENVIRONMENT", "local"))
    LOGGER_LEVEL = os.getenv("LOGGING_LEVEL", "INFO")
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", 0)
    ENVIRONMENT = os.getenv("ENVIRONMENT", "local")
    BLUEPRINT_COLLECTION = "SSR-DataSource"
    ENTITY_COLLECTION = "entities"
    DATA_SOURCES_COLLECTION = "data_sources"
    DYNAMIC_MODELS = "dynamic_models"
    SYSTEM_COLLECTION = "system"
    CACHE_MAX_SIZE = 200 if ENVIRONMENT == "local" else 0
    APPLICATION_HOME = os.getenv("APPLICATION_HOME", f"{Path(__file__).parent.absolute()}/home")
    DMT_SETTINGS_FILE = f"{APPLICATION_HOME}/dmt_settings.json"
    ENTITY_SETTINGS_FILE = f"{APPLICATION_HOME}/settings.json"
    SYSTEM_FOLDERS = ["SIMOS", "DMT"]
    VERIFY_IMPORTS = os.getenv("DMT_VERIFY_IMPORTS", True)
    with open(DMT_SETTINGS_FILE) as json_file:
        DMT_APPLICATION_SETTINGS = json.load(json_file)
    with open(ENTITY_SETTINGS_FILE) as json_file:
        ENTITY_APPLICATION_SETTINGS = json.load(json_file)

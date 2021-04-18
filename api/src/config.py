import json
import os
from pathlib import Path


class Config:
    MONGO_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME", "maf")
    MONGO_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD", "maf")
    MONGO_URI = os.getenv("MONGO_AZURE_URI", "")
    MONGO_DB = os.getenv("ENVIRONMENT", os.getenv("RADIX_ENVIRONMENT", "local"))
    LOGGER_LEVEL = os.getenv("LOGGING_LEVEL", "INFO")
    MAX_ENTITY_RECURSION_DEPTH = os.getenv("MAX_ENTITY_RECURSION_DEPTH", 50)
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", 0)
    ENVIRONMENT = os.getenv("ENVIRONMENT", "local")
    DYNAMIC_MODELS = "dynamic_models"
    CACHE_MAX_SIZE = 200
    APPLICATION_HOME = os.getenv("APPLICATION_HOME", f"{Path(__file__).parent}/home")
    DMT_SETTINGS_FILE = f"{APPLICATION_HOME}/dmt_settings.json"
    ENTITY_SETTINGS_FILE = f"{APPLICATION_HOME}/settings.json"
    SYSTEM_FOLDERS = ["DMT"]
    VERIFY_IMPORTS = os.getenv("DMT_VERIFY_IMPORTS", False)
    DMSS_HOST = os.getenv("DMSS_HOST", "dmss")
    DMSS_PORT = os.getenv("DMSS_PORT", "5000")
    DMSS_SCHEMA = "http" if ENVIRONMENT != "production" else "https"
    DMSS_API = f"{DMSS_SCHEMA}://{DMSS_HOST}:{DMSS_PORT}"
    APPLICATION_DATA_SOURCE = "apps"
    with open(DMT_SETTINGS_FILE) as json_file:
        DMT_APPLICATION_SETTINGS = json.load(json_file)
        DMT_APPLICATION_SETTINGS["code_generators"] = os.listdir(f"{APPLICATION_HOME}/code_generators")
    with open(ENTITY_SETTINGS_FILE) as json_file:
        ENTITY_APPLICATION_SETTINGS = json.load(json_file)

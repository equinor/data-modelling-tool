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
    DMT_ENTITIES_HOME = f"{Path(__file__).parent}/demo_app_home"
    VERIFY_IMPORTS = os.getenv("DMT_VERIFY_IMPORTS", False)
    DMSS_HOST = os.getenv("DMSS_HOST", "dmss")
    DMSS_PORT = os.getenv("DMSS_PORT", "5000")
    DMSS_SCHEMA = "http" if ENVIRONMENT != "production" else "https"
    DMSS_API = f"{DMSS_SCHEMA}://{DMSS_HOST}:{DMSS_PORT}"
    APPLICATION_DATA_SOURCE = "apps"
    with open(f"{APPLICATION_HOME}/settings.json") as json_file:
        APP_SETTINGS = json.load(json_file)
        APP_SETTINGS["code_generators"] = os.listdir(f"{APPLICATION_HOME}/code_generators")

    try:
        with open(f"{DMT_ENTITIES_HOME}/settings.json") as json_file:
            DMT_SETTINGS = json.load(json_file)
            DMT_SETTINGS["code_generators"] = os.listdir(f"{APPLICATION_HOME}/code_generators")
    except FileNotFoundError:
        pass

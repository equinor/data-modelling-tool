import os


class Config:
    REMOTE_DEBUG = 0
    LOGGER_LEVEL = os.getenv("LOGGING_LEVEL", "INFO")
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", 0)
    ENVIRONMENT = os.getenv("ENVIRONMENT", "")
    MONGO_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME", "maf")
    MONGO_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD", "maf")
    MONGO_URI = os.getenv("MONGO_AZURE_URI", "")
    MONGO_DB = os.getenv("MONGO_INITDB_DATABASE", "maf")
    MONGO_DATA_MODELLING_TOOL_DB = os.getenv("MONGO_DATA_MODELING_TOOL_DATABASE", "dmt")
    BLUEPRINT_COLLECTION = "templates"
    ENTITY_COLLECTION = "entities"
    DATA_SOURCES_COLLECTION = "data_sources"
    CACHE_MAX_SIZE = 0 if ENVIRONMENT == "local" else 64
    MASTER_BLUEPRINT = "templates/SIMOS/Blueprint"
    DMT_PACKAGE = "templates/DMT/Package"
    DMT_ENTITY_PACKAGE = "templates/DMT/EntityPackage"
    APPLICATION_HOME = "/home"

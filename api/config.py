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
    TEMPLATES_COLLECTION = "dmt-templates"
    DATA_SOURCES_COLLECTION = "data_sources"
    # TODO: CACHE_MAX_SIZE - Enable in production, disable in development
    CACHE_MAX_SIZE = 100

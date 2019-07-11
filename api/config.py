import os


class Config:
    REMOTE_DEBUG = 0
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 0)
    MONGO_USERNAME = os.getenv('MONGO_INITDB_ROOT_USERNAME', 'maf')
    MONGO_PASSWORD = os.getenv('MONGO_INITDB_ROOT_PASSWORD', 'maf')
    MONGO_DB = os.getenv('MONGO_INITDB_DATABASE', 'db')

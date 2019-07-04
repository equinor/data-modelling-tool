import os


class Config:
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', False)
    REMOTE_DEBUG = os.getenv('REMOTE_DEBUG', False)
    MONGO_USERNAME = os.getenv('MONGO_INITDB_ROOT_USERNAME', 'maf')
    MONGO_PASSWORD = os.getenv('MONGO_INITDB_ROOT_PASSWORD', 'maf')
    MONGO_DB = os.getenv('MONGO_INITDB_DATABASE', 'db')

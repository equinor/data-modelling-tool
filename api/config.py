import os


class Config:
    flask_debug = os.getenv('FLASK_DEBUG', False)

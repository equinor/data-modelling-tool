import logging

from config import Config

logging.basicConfig(level=Config.LOGGER_LEVEL, format="%(levelname)s:%(asctime)s %(message)s")
logger = logging.getLogger()

flask_log = logging.getLogger("werkzeug").setLevel(Config.LOGGER_LEVEL)

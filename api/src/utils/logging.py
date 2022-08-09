import logging

from config import Config

logging.basicConfig(level=Config.LOGGER_LEVEL, format="%(levelname)s:%(asctime)s %(message)s")
logger = logging.getLogger()

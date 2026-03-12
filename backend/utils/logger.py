import logging
from config import config

config.LOGS_PATH.mkdir(parents=True, exist_ok=True)

logger = logging.getLogger("ecolens")
logger.setLevel(logging.INFO)
logger.propagate = False

if not logger.handlers:
    fh = logging.FileHandler(config.LOGS_PATH / "ecolens.log")
    ch = logging.StreamHandler()

    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    fh.setFormatter(formatter)
    ch.setFormatter(formatter)

    logger.addHandler(fh)
    logger.addHandler(ch)

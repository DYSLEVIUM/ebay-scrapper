import logging
import os
from logging import Formatter
from logging.handlers import TimedRotatingFileHandler

from .config import get_base_path

logger = logging.getLogger(__name__)

handler = TimedRotatingFileHandler(
    os.path.join(get_base_path(), "logs/scrapper.log"),
    when="D",
    interval=1,
    backupCount=90,
    encoding="utf-8",
    delay=False,
)
formatter = Formatter(fmt="%(asctime)s %(levelname)s: %(message)s")
handler.setFormatter(formatter)

logger.setLevel(logging.INFO)

logger.addHandler(handler)

import configparser
import os
import pathlib


def get_base_path() -> str:
    return pathlib.Path(__file__).parent.parent.parent.resolve()


config = configparser.ConfigParser()
config.read(os.path.join(get_base_path(), "config.ini"))

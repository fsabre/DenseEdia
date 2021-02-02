import json
import pathlib

ROOT_PATH = pathlib.Path(__file__).parent.parent
config_path = ROOT_PATH.joinpath("config.json")

with config_path.open("r") as config_file:
    CONFIG = json.load(config_file)

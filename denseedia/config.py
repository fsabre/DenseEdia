import json
import pathlib

config_path = pathlib.Path(__file__).parent.with_name("config.json")

with config_path.open("r") as config_file:
    CONFIG = json.load(config_file)

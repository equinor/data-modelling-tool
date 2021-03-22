import os
from pathlib import Path
from typing import Dict

from utils.logging import logger


def load_generators(dir: str) -> Dict[str, Dict]:
    generators: Dict[str, Dict] = {}
    key = "code_generators"
    for generator_folder in os.listdir(f"{dir}/{key}"):
        plugin_name = generator_folder
        plugin_folder = f"{dir}/{key}/{plugin_name}"
        plugin_path = f"{plugin_folder}/__init__.py"
        label = __get_label(plugin_folder, plugin_name)
        generator = {"name": plugin_name, "label": label, "plugin_path": plugin_path}
        generators[plugin_name] = generator
        logger.debug(f"Loaded generator {label} at {plugin_path}")

    return generators


def __get_label(plugin_folder, plugin_name):
    name_path = Path(f"{plugin_folder}/NAME.txt")
    if name_path.exists():
        with open(name_path) as f:
            return f.read().strip()
    return f"{plugin_name} code generator"

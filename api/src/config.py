import json
import os
from pathlib import Path
from typing import Dict


class Config:
    MONGO_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME", "maf")
    MONGO_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD", "maf")
    MONGO_URI = os.getenv("MONGO_AZURE_URI", "")
    MONGO_DB = os.getenv("ENVIRONMENT", os.getenv("RADIX_ENVIRONMENT", "local"))
    LOGGER_LEVEL = os.getenv("LOGGING_LEVEL", "INFO")
    MAX_ENTITY_RECURSION_DEPTH = os.getenv("MAX_ENTITY_RECURSION_DEPTH", 50)
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", 0)
    ENVIRONMENT = os.getenv("ENVIRONMENT", "local")
    DYNAMIC_MODELS = "dynamic_models"
    CACHE_MAX_SIZE = 200
    APPLICATION_HOME = os.getenv("APPLICATION_HOME", f"{Path(__file__).parent}/home")
    DMT_ENTITIES_HOME = f"{Path(__file__).parent}/demo_app_home"
    VERIFY_IMPORTS = os.getenv("DMT_VERIFY_IMPORTS", False)
    DMSS_HOST = os.getenv("DMSS_HOST", "dmss")
    DMSS_PORT = os.getenv("DMSS_PORT", "5000")
    DMSS_SCHEMA = "http" if ENVIRONMENT != "production" else "https"
    DMSS_API = f"{DMSS_SCHEMA}://{DMSS_HOST}:{DMSS_PORT}"
    IMPORT_BLOBS = ["DMT/data/EntityApp-DS/DMT-demo/PDF-Demo/MyPdf.json"]

    APP_NAMES = next(os.walk(APPLICATION_HOME))[1]  # Every folder under HOME represents a separate app
    APP_SETTINGS: Dict[str, dict] = {}  # Dict holding settings for all loaded applications
    APPS_DATASOURCE_SUBFOLDER = "data_sources"

    def load_app_settings(self):
        for app in self.APP_NAMES:
            try:
                with open(f"{self.APPLICATION_HOME}/{app}/settings.json") as json_file:
                    self.APP_SETTINGS[app] = json.load(json_file)
                    self.APP_SETTINGS[app]["file_loc"] = json_file.name

                    # Create a list of data sources the application uses, based on folder names directly under
                    # HOME/data, and the list of "extraDataSources" from the applications settings file
                    self.APP_SETTINGS[app]["data_sources"] = os.listdir(
                        f"{self.APPLICATION_HOME}/{app}/data/"
                    ) + self.APP_SETTINGS[app].get("extraDataSources", [])

                    code_gen_folder = Path(f"{self.APPLICATION_HOME}/{app}/code_generators")
                    if code_gen_folder.is_dir():
                        self.APP_SETTINGS[app]["code_generators"] = os.listdir(str(code_gen_folder))
            except FileNotFoundError:
                raise FileNotFoundError(
                    f"No settings file found for the app '{app}'."
                    f"Each application requires a 'settings.json' file located at "
                    f"'{self.APPLICATION_HOME}/{{name-of-app}}/'"
                )
            print(f"Successfully loaded app '{app}'")


config = Config()
config.load_app_settings()
